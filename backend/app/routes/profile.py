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

    # A newly registered user may not have completed onboarding yet. Return an
    # empty profile rather than inventing education, skills, or experience.
    default_profile = {
        "user_id": user_id,
        "name": current_user.get("name", ""),
        "email": current_user.get("email", ""),
        "phone": "",
        "location": "",
        "education": "",
        "degree": "",
        "college": "",
        "graduation_year": None,
        "cgpa": None,
        "technical_skills": [],
        "soft_skills": [],
        "certifications": [],
        "projects": [],
        "experience": [],
        "preferred_career": "Software Developer",
        "preferred_job_type": "",
        "preferred_location": "",
        "education_level": "",
        "specialization": "",
        "current_year": "",
        "programming_languages": [],
        "career_interests": [],
        "target_job_role": "",
        "experience_level": "",
        "learning_goals": [],
        "profile_picture": ""
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
