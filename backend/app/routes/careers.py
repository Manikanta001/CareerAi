from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.middleware.auth import get_current_user
from app.services.career_service import get_all_careers, get_recommended_careers_for_user, get_skill_gap_for_user
from app.utils.helpers import success_response

router = APIRouter(prefix="/careers", tags=["Career Recommendation"])

@router.get("")
def list_careers():
    careers = get_all_careers()
    return success_response(careers, "Careers retrieved")

@router.get("/recommended")
def get_recommended(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    recommended = get_recommended_careers_for_user(user_id)
    return success_response(recommended, "Recommended careers calculated")

@router.get("/{career_id}")
def get_career_by_id(career_id: str):
    careers = get_all_careers()
    career = next((c for c in careers if c.get("id") == career_id), None)
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")
    return success_response(career, "Career details retrieved")
