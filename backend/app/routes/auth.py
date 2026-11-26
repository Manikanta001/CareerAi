from fastapi import APIRouter, Depends, HTTPException
from app.schemas.auth import UserRegister, UserLogin
from app.services.auth_service import register_user, login_user
from app.middleware.auth import get_current_user
from app.database.mongodb import get_database
from app.utils.helpers import success_response

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(user_data: UserRegister):
    res = register_user(user_data)
    return success_response(res, "User registered successfully")

@router.post("/login")
def login(credentials: UserLogin):
    res = login_user(credentials)
    return success_response(res, "Login successful")

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    public_user = {key: value for key, value in current_user.items() if key not in {"_id", "password"}}
    db = get_database()
    if db is not None:
        profile = db.profiles.find_one({"user_id": public_user.get("id")}, {"preferred_career": 1})
        if profile and profile.get("preferred_career"):
            public_user["preferred_career"] = profile["preferred_career"]
    return success_response(public_user, "User profile retrieved")
