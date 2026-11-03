from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.middleware.auth import get_current_user
from app.ai.skill_extractor import SKILL_TAXONOMY
from app.services.career_service import get_skill_gap_for_user
from app.utils.helpers import success_response

router = APIRouter(prefix="/skills", tags=["Skills & Gap Analysis"])

@router.get("")
def get_skills():
    return success_response(SKILL_TAXONOMY, "Skills taxonomy list")

@router.get("/gaps")
def get_skill_gaps(target_career: Optional[str] = Query(None), current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    gap = get_skill_gap_for_user(user_id, target_career)
    return success_response(gap, "Skill gap analysis generated")
