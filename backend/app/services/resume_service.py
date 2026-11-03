import os
from datetime import datetime, timezone
from fastapi import UploadFile, HTTPException
from app.config import settings
from app.utils.validators import validate_file_extension
from app.ai.resume_parser import extract_text_from_pdf, extract_text_from_docx, parse_resume_sections, clean_text
from app.ai.skill_extractor import extract_skills_from_text
from app.ai.resume_scorer import calculate_resume_score
from app.database.mongodb import get_database

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
                "raw_text": raw_text[:2000],
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
            return resume_doc.get("analysis", {})
    
    # Return default analysis if none exists
    default_skills = ["Python", "Java", "FastAPI", "MongoDB", "SQL", "Git"]
    return calculate_resume_score("Default resume text", {"contact": True, "education": True, "skills": True, "projects": True}, default_skills)
