from fastapi import APIRouter, Depends
from app.middleware.auth import get_current_user
from app.services.performance_service import get_user_performance_summary
from app.utils.helpers import success_response

router = APIRouter(prefix="/performance", tags=["Performance Analytics"])

@router.get("")
def get_performance(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    summary = get_user_performance_summary(user_id)
    return success_response(summary, "Performance metrics retrieved")

@router.get("/subjects")
def get_subject_performance(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    summary = get_user_performance_summary(user_id)
    return success_response(summary.get("subject_performance", {}), "Subject breakdown retrieved")
