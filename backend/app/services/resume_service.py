import os
from datetime import datetime, timezone
from fastapi import UploadFile, HTTPException
from app.config import settings
from app.utils.validators import validate_file_extension
from app.ai.resume_parser import extract_text_from_pdf, extract_text_from_docx, parse_resume_sections, clean_text
from app.ai.skill_extractor import extract_skills_from_text
from app.ai.resume_scorer import SCORING_VERSION, calculate_resume_score
from app.ai.skill_gap import RESOURCE_MAPPING
from app.database.mongodb import get_database

# ---------------------------------------------------------------------------
# Existing functions (UNCHANGED)
# ---------------------------------------------------------------------------

async def process_resume_upload(user_id: str, file: UploadFile) -> dict:
    if not validate_file_extension(file.filename):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and DOCX files are allowed.")

    file_ext = file.filename.rsplit(".", 1)[1].lower()
    file_path = os.path.join(settings.UPLOAD_DIR, f"{user_id}_resume.{file_ext}")

    content = await file.read(10 * 1024 * 1024 + 1)
    if len(content) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File size exceeds maximum 10MB limit")

    with open(file_path, "wb") as f:
        f.write(content)

    if file_ext == "pdf":
        raw_text = extract_text_from_pdf(file_path)
    else:
        raw_text = extract_text_from_docx(file_path)

    raw_text = clean_text(raw_text)
    if not raw_text:
        os.remove(file_path)
        raise HTTPException(status_code=400, detail="We could not extract text from this file. Upload a readable PDF or DOCX.")

    sections = parse_resume_sections(raw_text)
    extracted_skills = extract_skills_from_text(raw_text)
    analysis = calculate_resume_score(raw_text, sections, extracted_skills)

    db = get_database()
    if db is not None:
        db.resumes.update_one(
            {"user_id": user_id},
            {"$set": {
                "user_id": user_id,
                "filename": file.filename,
                "raw_text": raw_text[:12000],
                "sections": sections,
                "analysis": analysis,
                "updated_at": datetime.now(timezone.utc)
            }},
            upsert=True
        )
        # Automatically update user profile skills
        if extracted_skills:
            db.profiles.update_one(
                {"user_id": user_id},
                {"$addToSet": {"technical_skills": {"$each": extracted_skills}}}
            )

    return {
        "filename": file.filename,
        "analysis": analysis
    }


def get_latest_resume_analysis(user_id: str) -> dict:
    db = get_database()
    if db is not None:
        resume_doc = db.resumes.find_one({"user_id": user_id})
        if resume_doc:
            return _refresh_saved_analysis_if_needed(resume_doc, db)

    return None


def _refresh_saved_analysis_if_needed(resume_doc: dict, db) -> dict:
    """Re-score previously uploaded resumes once when the rubric changes."""
    analysis = resume_doc.get("analysis") or {}
    raw_text = resume_doc.get("raw_text") or ""
    if analysis.get("scoring_version") == SCORING_VERSION or not raw_text.strip():
        return analysis

    sections = parse_resume_sections(raw_text)
    extracted_skills = extract_skills_from_text(raw_text)
    updated_analysis = calculate_resume_score(raw_text, sections, extracted_skills)
    resume_doc["analysis"] = updated_analysis
    resume_doc["sections"] = sections
    try:
        db.resumes.update_one(
            {"user_id": resume_doc.get("user_id")},
            {"$set": {"analysis": updated_analysis, "sections": sections}},
        )
    except Exception:
        # The newly calculated score can still be shown even if persistence is
        # temporarily unavailable; a later request will retry the migration.
        pass
    return updated_analysis


# ---------------------------------------------------------------------------
# New onboarding functions
# ---------------------------------------------------------------------------

_FALLBACK_CAREERS = [
    {
        "title": "Software Developer",
        "required_skills": ["Java", "Python", "SQL", "Git", "DSA", "OOP"],
        "preferred_skills": ["Docker", "REST API", "CI/CD"],
    },
    {
        "title": "Python Developer",
        "required_skills": ["Python", "FastAPI", "MongoDB", "SQL", "Git", "REST API Design"],
        "preferred_skills": ["Docker", "Redis", "Pandas"],
    },
    {
        "title": "Frontend Developer",
        "required_skills": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Git"],
        "preferred_skills": ["TypeScript", "Next.js", "Redux"],
    },
    {
        "title": "Full Stack Developer",
        "required_skills": ["JavaScript", "React", "Node.js", "FastAPI", "MongoDB", "SQL", "Git"],
        "preferred_skills": ["Docker", "AWS", "TypeScript"],
    },
    {
        "title": "Data Analyst",
        "required_skills": ["Python", "SQL", "Pandas", "NumPy", "Power BI", "Excel"],
        "preferred_skills": ["Tableau", "R", "Statistics"],
    },
]

_SKILL_ALIASES = {
    "rest api design": "rest api",
    "data structures and algorithms": "dsa",
    "data structures & algorithms": "dsa",
    "object oriented programming": "oop",
    "object-oriented programming": "oop",
}


def _canonical_skill(skill: str) -> str:
    normalized = " ".join(skill.lower().split())
    return _SKILL_ALIASES.get(normalized, normalized)


def _get_careers_from_db_or_fallback(db) -> list:
    """Return careers list from DB or use the built-in fallback."""
    try:
        if db is not None:
            careers = list(db.careers.find({}))
            if careers:
                # Normalise _id field
                for c in careers:
                    c.pop("_id", None)
                return careers
    except Exception:
        pass
    return _FALLBACK_CAREERS


def _build_learning_plan(missing_required: list, missing_preferred: list) -> list:
    """Build a prioritised learning plan for missing skills."""
    lesson_links = {
        "Docker": "https://docs.docker.com/get-started/",
        "DSA": "https://neetcode.io/roadmap",
        "SQL": "https://sqlzoo.net/wiki/SQL_Tutorial",
        "React": "https://react.dev/learn",
        "Python": "https://docs.python.org/3/tutorial/",
        "Java": "https://dev.java/learn/",
        "JavaScript": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        "TypeScript": "https://www.typescriptlang.org/docs/",
        "FastAPI": "https://fastapi.tiangolo.com/tutorial/",
        "MongoDB": "https://learn.mongodb.com/",
        "Node.js": "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
        "Git": "https://git-scm.com/doc",
        "REST API Design": "https://fastapi.tiangolo.com/tutorial/",
        "AWS": "https://skillbuilder.aws/",
    }
    plan = []

    for skill in missing_required[:5]:  # top 5 high-priority first
        info = RESOURCE_MAPPING.get(skill, {
            "resource": f"Official {skill} Documentation & Crash Course",
            "time": "10 hours",
            "project": f"Build a practical mini-project applying {skill}",
        })
        plan.append({
            "skill": skill,
            "priority": "High",
            "reason": f"{skill} is a required skill for your target career path.",
            "resource": info["resource"],
            "estimated_hours": info["time"],
            "lesson_link": lesson_links.get(skill),
        })

    for skill in missing_preferred[:5]:  # top 5 medium-priority
        info = RESOURCE_MAPPING.get(skill, {
            "resource": f"Official {skill} Documentation & Crash Course",
            "time": "8 hours",
            "project": f"Build a practical mini-project applying {skill}",
        })
        plan.append({
            "skill": skill,
            "priority": "Medium",
            "reason": f"{skill} is a preferred/bonus skill that will strengthen your profile.",
            "resource": info["resource"],
            "estimated_hours": info["time"],
            "lesson_link": lesson_links.get(skill),
        })

    return plan


def _fetch_practice_questions(db, missing_skills: list) -> list:
    """Pull up to 5 questions from db.questions whose topic/subject matches missing skills."""
    if db is None or not missing_skills:
        return []
    try:
        missing_lower = [s.lower() for s in missing_skills]
        questions_cursor = db.questions.find({})
        matched = []
        for q in questions_cursor:
            subject = (q.get("subject") or "").lower()
            topic = (q.get("topic") or "").lower()
            if any(ms in subject or ms in topic for ms in missing_lower):
                matched.append({
                    "id": str(q.get("_id", "")),
                    "question": q.get("question", ""),
                    "subject": q.get("subject", ""),
                    "topic": q.get("topic", ""),
                    "difficulty": q.get("difficulty", ""),
                })
            if len(matched) >= 5:
                break
        return matched
    except Exception:
        return []


def generate_onboarding_report(user_id: str, career_title: str = None) -> dict:
    """
    Generate a comprehensive onboarding report for the given user based on
    their uploaded resume and their career goal.
    """
    try:
        db = get_database()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {exc}") from exc

    # ------------------------------------------------------------------
    # 1. Fetch resume document
    # ------------------------------------------------------------------
    try:
        resume_doc = db.resumes.find_one({"user_id": user_id}) if db is not None else None
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch resume data: {exc}") from exc

    if not resume_doc:
        return {"has_resume": False, "message": "No resume uploaded yet."}

    analysis = _refresh_saved_analysis_if_needed(resume_doc, db) if db is not None else (resume_doc.get("analysis") or {})
    filename = resume_doc.get("filename", "")
    raw_text = resume_doc.get("raw_text", "")

    # Resume score
    resume_score = analysis.get("overall_score")

    # Extracted skills from stored analysis
    extracted_skills: list = analysis.get("extracted_skills") or []

    # Sections: prefer stored; fall back to re-parsing raw_text snippet
    sections = resume_doc.get("sections") or {}
    contains_old_placeholders = any(
        isinstance(items, list) and any(str(item).startswith("Found ") for item in items)
        for items in sections.values()
    )
    if (not sections or contains_old_placeholders) and raw_text:
        try:
            sections = parse_resume_sections(raw_text)
        except Exception:
            sections = {}

    sections_found = {
        "education": sections.get("education", []) if isinstance(sections.get("education", []), list) else [],
        "projects": sections.get("projects", []) if isinstance(sections.get("projects", []), list) else [],
        "experience": sections.get("experience", []) if isinstance(sections.get("experience", []), list) else [],
    }

    # ------------------------------------------------------------------
    # 2. Determine career goal
    # ------------------------------------------------------------------
    preferred_career: str = career_title or "Software Developer"
    try:
        if db is not None:
            profile = db.profiles.find_one({"user_id": user_id})
            if profile and profile.get("preferred_career"):
                preferred_career = profile["preferred_career"]
    except Exception:
        pass

    # ------------------------------------------------------------------
    # 3. Get careers and find target
    # ------------------------------------------------------------------
    careers = _get_careers_from_db_or_fallback(db)
    target_career = next(
        (c for c in careers if c.get("title", "").lower() == preferred_career.lower()),
        careers[0],
    )

    target_career_title: str = target_career.get("title", preferred_career)
    required_skills: list = target_career.get("required_skills") or []
    preferred_skills: list = target_career.get("preferred_skills") or []

    # ------------------------------------------------------------------
    # 4. Skill comparison (case-insensitive)
    # ------------------------------------------------------------------
    if not extracted_skills:
        return {
            "has_resume": True,
            "analysis_incomplete": True,
            "filename": filename,
            "resume_score": resume_score,
            "extracted_skills": [],
            "career_goal": target_career_title,
            "readiness_percentage": None,
            "known_skills": [],
            "missing_required": [],
            "missing_preferred": [],
            "learning_plan": [],
            "practice_questions": [],
            "sections_found": sections_found,
            "message": "We could read the resume, but could not detect skills from our supported list. No skill gaps were inferred. Try a text-based PDF or DOCX with a clear skills section.",
        }

    extracted_skill_set = {_canonical_skill(skill) for skill in extracted_skills}

    all_career_skills = {_canonical_skill(skill) for skill in required_skills + preferred_skills}

    known_skills = [
        s for s in extracted_skills
        if _canonical_skill(s) in all_career_skills
    ]

    missing_required = [
        s for s in required_skills
        if _canonical_skill(s) not in extracted_skill_set
    ]
    missing_preferred = [
        s for s in preferred_skills
        if _canonical_skill(s) not in extracted_skill_set
    ]

    # Readiness percentage based on required skills coverage
    if required_skills:
        acquired_count = len(required_skills) - len(missing_required)
        readiness_percentage = round((acquired_count / len(required_skills)) * 100, 1)
    else:
        readiness_percentage = 50.0

    # ------------------------------------------------------------------
    # 5. Learning plan
    # ------------------------------------------------------------------
    learning_plan = _build_learning_plan(missing_required, missing_preferred)

    # ------------------------------------------------------------------
    # 6. Practice questions
    # ------------------------------------------------------------------
    all_missing = missing_required + missing_preferred
    practice_questions = _fetch_practice_questions(db, all_missing)

    return {
        "has_resume": True,
        "filename": filename,
        "resume_score": resume_score,
        "extracted_skills": extracted_skills,
        "career_goal": target_career_title,
        "readiness_percentage": readiness_percentage,
        "known_skills": known_skills,
        "missing_required": missing_required,
        "missing_preferred": missing_preferred,
        "learning_plan": learning_plan,
        "practice_questions": practice_questions,
        "sections_found": sections_found,
    }


def get_onboarding_status(user_id: str) -> dict:
    """
    Return whether the user has uploaded a resume and whether onboarding
    has been marked complete.
    """
    try:
        db = get_database()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {exc}") from exc

    has_resume = False
    onboarding_completed = False

    try:
        if db is not None:
            resume_doc = db.resumes.find_one({"user_id": user_id}, {"_id": 1})
            has_resume = resume_doc is not None

            profile = db.profiles.find_one({"user_id": user_id}, {"onboarding_completed": 1})
            if profile:
                onboarding_completed = bool(profile.get("onboarding_completed", False))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch onboarding status: {exc}") from exc

    return {
        "has_resume": has_resume,
        "onboarding_completed": onboarding_completed,
    }


def mark_onboarding_complete(user_id: str) -> None:
    """Mark the user's onboarding as completed in their profile document."""
    try:
        db = get_database()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {exc}") from exc

    try:
        if db is not None:
            db.profiles.update_one(
                {"user_id": user_id},
                {"$set": {"onboarding_completed": True}},
                upsert=True,
            )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to mark onboarding complete: {exc}") from exc


def get_learning_progress(user_id: str) -> dict:
    db = get_database()
    report = generate_onboarding_report(user_id)
    planned_skills = {item["skill"] for item in report.get("learning_plan", [])}
    profile = db.profiles.find_one({"user_id": user_id}, {"completed_learning_skills": 1}) if db is not None else None
    completed = [
        skill for skill in (profile or {}).get("completed_learning_skills", [])
        if skill in planned_skills
    ]
    return {"completed_skills": completed, "total_skills": len(planned_skills)}


def update_learning_progress(user_id: str, completed_skills: list[str]) -> dict:
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database is unavailable")
    report = generate_onboarding_report(user_id)
    planned_skills = {item["skill"] for item in report.get("learning_plan", [])}
    completed = sorted(set(completed_skills).intersection(planned_skills))
    db.profiles.update_one(
        {"user_id": user_id},
        {"$set": {"completed_learning_skills": completed}},
        upsert=True,
    )
    return {"completed_skills": completed, "total_skills": len(planned_skills)}
