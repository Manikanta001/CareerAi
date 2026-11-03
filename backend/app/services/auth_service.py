from datetime import datetime, timezone
from fastapi import HTTPException
from app.database.mongodb import get_database
from app.utils.security import hash_password, verify_password, create_access_token
from app.schemas.auth import UserRegister, UserLogin

def register_user(user_data: UserRegister) -> dict:
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database is unavailable")
    existing = db.users.find_one({"email": user_data.email.lower()})
    if existing:
        raise HTTPException(status_code=409, detail="User with this email already exists")

    hashed_pwd = hash_password(user_data.password)
    user_doc = {
        "name": user_data.name,
        "email": user_data.email.lower(),
        "password": hashed_pwd,
        "role": "USER",
        "created_at": datetime.now(timezone.utc)
    }

    result = db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    try:
        db.profiles.insert_one({
            "user_id": user_id,
            "name": user_data.name,
            "email": user_data.email.lower(),
            "phone": "",
            "location": "",
            "education": "B.Tech Computer Science",
            "degree": "B.Tech",
            "college": "",
            "graduation_year": 2026,
            "cgpa": 8.0,
            "technical_skills": ["C", "C++", "Java", "Python", "SQL"],
            "soft_skills": ["Problem Solving", "Communication"],
            "certifications": [],
            "projects": [],
            "experience": [],
            "preferred_career": "Software Developer",
            "preferred_job_type": "Full Time",
            "preferred_location": "Remote / Flexible"
        })
    except Exception:
        db.users.delete_one({"_id": result.inserted_id})
        raise

    token = create_access_token({"sub": user_id, "email": user_data.email.lower(), "role": "USER", "name": user_data.name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user_data.name,
            "email": user_data.email.lower(),
            "role": "USER"
        }
    }

def login_user(credentials: UserLogin) -> dict:
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database is unavailable")
    user = db.users.find_one({"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id = str(user["_id"])
    user_role = user.get("role", "USER")
    user_name = user.get("name", "User")

    token = create_access_token({"sub": user_id, "email": credentials.email.lower(), "role": user_role, "name": user_name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user_name,
            "email": credentials.email.lower(),
            "role": user_role
        }
    }
