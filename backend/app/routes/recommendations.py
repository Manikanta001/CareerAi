from fastapi import APIRouter, Depends
from app.middleware.auth import get_current_user
from app.services.recommendation_service import get_daily_recommendation_plan
from app.utils.helpers import success_response

router = APIRouter(prefix="/recommendations", tags=["Personalized Recommendations"])

@router.get("/daily")
def get_daily_plan(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    plan = get_daily_recommendation_plan(user_id)
    return success_response(plan, "Daily study plan generated")

@router.get("")
def get_general_recommendations(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    plan = get_daily_recommendation_plan(user_id)
    return success_response({
        "study_plan": plan,
        "suggested_actions": [
            "Complete 1 Mock Test this week to measure accuracy under time pressure.",
            "Focus 40 mins on SQL Joins & Normalization.",
            "Update resume with recent FastAPI project."
        ]
    }, "Recommendations generated")
