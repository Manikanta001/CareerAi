import re
from typing import Any


SCORING_VERSION = 2

_ACTION_VERBS = {
    "analyzed", "automated", "built", "created", "delivered", "designed", "developed",
    "deployed", "improved", "increased", "implemented", "launched", "led", "managed",
    "optimized", "reduced", "resolved", "streamlined", "tested", "trained", "transformed",
}
_TECH_TERMS = {
    "api", "aws", "c", "c++", "css", "docker", "fastapi", "git", "html", "java",
    "javascript", "kubernetes", "linux", "mongodb", "mysql", "node.js", "postgresql",
    "python", "react", "redis", "rest", "sql", "tensorflow", "typescript",
}
_DEGREE_TERMS = re.compile(
    r"\b(b\.?\s?tech|b\.?e\.?|bachelor|b\.?sc|m\.?tech|m\.?e\.?|master|ph\.?d|diploma)\b", re.I
)
_ROLE_TERMS = re.compile(r"\b(intern|engineer|developer|analyst|associate|manager|researcher|volunteer|lead)\b", re.I)
_METRIC_PATTERNS = (
    re.compile(r"\b\d+(?:\.\d+)?\s*(?:%|percent|users?|customers?|records?|requests?|ms|milliseconds?|seconds?|minutes?|hours?|days?|weeks?|months?|years?|team members?)\b", re.I),
    re.compile(r"(?:increased|reduced|improved|decreased|saved|grew|cut|boosted)[^\n.;]{0,35}\b\d+(?:\.\d+)?", re.I),
    re.compile(r"\b(?:over|more than|up to)\s+\d[\d,]*(?:\s+(?:users?|records?|customers?|requests?|students?|products?))?\b", re.I),
)


def _lines(value: Any) -> list[str]:
    if isinstance(value, str):
        values = value.splitlines()
    elif isinstance(value, (list, tuple)):
        values = [str(item) for item in value]
    else:
        values = []
    return [line.strip() for line in values if line and line.strip()]


def _section_text(sections: dict, name: str) -> str:
    return "\n".join(_lines(sections.get(name)))


def _action_count(text: str) -> int:
    words = set(re.findall(r"[a-z]+", text.lower()))
    return len(words.intersection(_ACTION_VERBS))


def _metric_count(text: str) -> int:
    matches = set()
    for pattern in _METRIC_PATTERNS:
        matches.update(match.group(0).lower() for match in pattern.finditer(text))
    return len(matches)


def _content_score(section_text: str, *, maximum: int, action_cap: int, metric_cap: int) -> int:
    """Score evidence in a section; a heading alone earns no quality points."""
    if not section_text:
        return 0
    lines = _lines(section_text)
    descriptive_lines = sum(1 for line in lines if len(line.split()) >= 7)
    points = min(6, descriptive_lines * 2)
    points += min(action_cap, _action_count(section_text))
    points += min(metric_cap, _metric_count(section_text) * 2)
    return min(maximum, points)


def calculate_resume_score(raw_text: str, sections: dict, extracted_skills: list[str]) -> dict:
    """Estimate resume readiness from extracted content using an explicit 100-point rubric.

    This is a deterministic text-based estimate, not a recruiter decision or a
    measure of the candidate's actual skill proficiency.
    """
    text = raw_text or ""
    lower_text = text.lower()
    words = re.findall(r"\b[\w+#.-]+\b", text)

    # Contact details: email, phone, professional profile links, and location.
    contact_score = 0
    if re.search(r"[\w.+-]+@[\w.-]+\.[a-z]{2,}", text, re.I):
        contact_score += 3
    if re.search(r"(?:\+?\d[\d ()-]{7,}\d)", text):
        contact_score += 2
    if re.search(r"linkedin\.com|github\.com|portfolio", text, re.I):
        contact_score += 2
    if re.search(r"\b(?:location|based in|city)\s*[:\-]", text, re.I):
        contact_score += 1

    # Education: assess whether the entry identifies a qualification, institution,
    # and date/result instead of rewarding the heading alone.
    education_text = _section_text(sections, "education")
    education_score = 0
    if education_text:
        education_score += 2
        if _DEGREE_TERMS.search(education_text):
            education_score += 3
        if re.search(r"\b(university|college|institute|school)\b", education_text, re.I):
            education_score += 2
        if re.search(r"\b(?:19|20)\d{2}\b", education_text):
            education_score += 2
        if re.search(r"\b(?:gpa|cgpa|grade|percentage|\d\.\d{1,2}\s*/\s*\d)\b", education_text, re.I):
            education_score += 1
    education_score = min(10, education_score)

    skills_text = _section_text(sections, "skills")
    skill_count = len({skill.casefold() for skill in (extracted_skills or []) if str(skill).strip()})
    skills_score = min(8, round(skill_count * 0.8)) + (4 if skills_text else 0)

    project_text = _section_text(sections, "projects")
    project_score = _content_score(project_text, maximum=12, action_cap=4, metric_cap=2)
    if project_text:
        tech_mentions = sum(1 for term in _TECH_TERMS if re.search(rf"(?<![\w+#.-]){re.escape(term)}(?![\w+#.-])", project_text, re.I))
        project_score = min(18, project_score + min(4, tech_mentions))

    experience_text = _section_text(sections, "experience")
    experience_score = _content_score(experience_text, maximum=15, action_cap=5, metric_cap=3)
    if experience_text:
        if _ROLE_TERMS.search(experience_text):
            experience_score = min(15, experience_score + 2)
        if re.search(r"\b(?:19|20)\d{2}\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b", experience_text, re.I):
            experience_score = min(15, experience_score + 2)

    achievements_text = "\n".join([
        _section_text(sections, "certifications"),
        _section_text(sections, "achievements"),
        "\n".join(line for line in text.splitlines() if re.match(r"\s*(achievements?|awards?|leadership|volunteering)\b", line, re.I)),
    ]).strip()
    achievements_score = 0
    if achievements_text:
        achievements_score = min(6, 2 + sum(1 for line in _lines(achievements_text) if len(line.split()) >= 3))
        if re.search(r"\b(certified|certification|award|winner|finalist|volunteer|captain|president)\b", achievements_text, re.I):
            achievements_score = min(10, achievements_score + 2)
        if _METRIC_PATTERNS[0].search(achievements_text):
            achievements_score = min(10, achievements_score + 2)

    # Text extraction cannot judge fonts/colors, but can assess useful length,
    # named sections, and scannable bullet structure.
    word_count = len(words)
    if 300 <= word_count <= 900:
        length_score = 5
    elif 180 <= word_count <= 1200:
        length_score = 4
    elif 100 <= word_count <= 1500:
        length_score = 3
    elif word_count >= 50:
        length_score = 2
    else:
        length_score = 1
    section_count = sum(bool(_section_text(sections, name)) for name in ("education", "skills", "projects", "experience", "certifications", "achievements"))
    organization_score = min(4, section_count)
    bullet_count = sum(1 for line in text.splitlines() if re.match(r"\s*(?:[-*•]|\d+[.)])\s+", line))
    readability_score = length_score + organization_score + min(3, bullet_count)

    evidence_text = "\n".join((project_text, experience_text, achievements_text))
    impact_score = min(9, _metric_count(evidence_text) * 3) + min(6, _action_count(evidence_text))

    score_parts = {
        "Contact Information": (contact_score, 8),
        "Education": (education_score, 10),
        "Skills": (skills_score, 12),
        "Projects": (project_score, 18),
        "Experience": (experience_score, 15),
        "Certifications & Achievements": (achievements_score, 10),
        "Readability & Organization": (readability_score, 12),
        "Impact & Outcomes": (impact_score, 15),
    }
    total_score = sum(score for score, _maximum in score_parts.values())

    suggestions = []
    if contact_score < 6:
        suggestions.append("Add clear contact details and professional links such as LinkedIn, GitHub, or a portfolio.")
    if education_score < 7:
        suggestions.append("Make your degree, institution, graduation date, and relevant academic result easy to identify.")
    if skills_score < 8:
        suggestions.append("Add a concise skills section with specific languages, tools, and technologies you can discuss in an interview.")
    if project_score < 10:
        suggestions.append("Expand project entries with your contribution, technologies used, and the problem each project solved.")
    if experience_score < 7:
        suggestions.append("Describe internships, work, leadership, volunteering, or open-source contributions when you have them; do not add experience you do not have.")
    if achievements_score < 5:
        suggestions.append("Include relevant certifications, awards, leadership, or competition results only when you have genuine examples.")
    if readability_score < 8:
        suggestions.append("Use clear section headings and concise bullet points so the resume is easy to scan.")
    if impact_score < 7:
        suggestions.append("Where accurate, quantify outcomes in project or experience bullets and lead with specific action verbs.")

    return {
        "overall_score": total_score,
        "scoring_version": SCORING_VERSION,
        "score_basis": "Text-based estimate of completeness, detail, organization, and evidence in the extracted resume. It does not measure skill proficiency or guarantee recruiter outcomes.",
        "word_count": word_count,
        "section_scores": {name: f"{score}/{maximum}" for name, (score, maximum) in score_parts.items()},
        "extracted_skills": extracted_skills or [],
        "suggestions": suggestions,
    }
