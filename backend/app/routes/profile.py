from fastapi import APIRouter, Depends
from bson import ObjectId
from app.schemas.profile import ProfileUpdate
from app.middleware.auth import get_current_user
from app.database.mongodb import get_database
from app.utils.helpers import success_response

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("")
def get_profile(current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = current_user.get("id")
    
    if db is not None:
        profile = db.profiles.find_one({"user_id": user_id})
        if profile:
            profile["id"] = str(profile["_id"])
            del profile["_id"]
            return success_response(profile, "Profile retrieved")

    # Default profile fallback
    default_profile = {
        "user_id": user_id,
        "name": current_user.get("name", "Student User"),
        "email": current_user.get("email", "user@careerai.com"),
        "phone": "+91 9876543210",
        "location": "Bengaluru, India",
        "education": "B.Tech in Computer Science and Engineering",
        "degree": "B.Tech",
        "college": "National Institute of Technology",
        "graduation_year": 2026,
        "cgpa": 8.4,
        "technical_skills": ["C", "C++", "Java", "Python", "SQL", "Git", "FastAPI", "React", "MongoDB"],
        "soft_skills": ["Problem Solving", "Team Leadership", "Communication"],
        "certifications": ["AWS Certified Cloud Practitioner", "NPTEL Data Structures"],
        "projects": [
            {"title": "CareerAI Placement Platform", "tech": "FastAPI, React, MongoDB", "desc": "AI driven career intelligence software."}
        ],
        "experience": [
            {"role": "Software Development Intern", "company": "TechStart Inc", "duration": "3 months"}
        ],
        "preferred_career": "Software Developer",
        "preferred_job_type": "Full Time",
        "preferred_location": "Bengaluru / Remote"
    }
    return success_response(default_profile, "Profile retrieved")

@router.put("")
def update_profile(profile_data: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = current_user.get("id")
    update_dict = {k: v for k, v in profile_data.model_dump().items() if v is not None}
    
    if db is not None:
        db.profiles.update_one(
            {"user_id": user_id},
            {"$set": update_dict},
            upsert=True
        )
        if profile_data.name:
            db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"name": profile_data.name}})

    return success_response(update_dict, "Profile updated successfully")
