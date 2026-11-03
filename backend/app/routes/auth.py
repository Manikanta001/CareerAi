from fastapi import APIRouter, Depends, HTTPException
from app.schemas.auth import UserRegister, UserLogin
from app.services.auth_service import register_user, login_user
from app.middleware.auth import get_current_user
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
    return success_response(current_user, "User profile retrieved")
