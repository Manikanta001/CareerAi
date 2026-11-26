from fastapi import APIRouter, Depends, UploadFile, File
from app.middleware.auth import get_current_user
from app.services.resume_service import (
    process_resume_upload,
    get_latest_resume_analysis,
    generate_onboarding_report,
    get_onboarding_status,
    mark_onboarding_complete,
    get_learning_progress,
    update_learning_progress,
)
from app.utils.helpers import success_response
from app.schemas.learning import LearningProgressUpdate

router = APIRouter(prefix="/resume", tags=["Resume Analyzer"])


# ---------------------------------------------------------------------------
# Existing endpoints (UNCHANGED)
# ---------------------------------------------------------------------------

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    result = await process_resume_upload(user_id, file)
    return success_response(result, "Resume uploaded and analyzed successfully")


@router.get("")
def get_resume(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    analysis = get_latest_resume_analysis(user_id)
    return success_response(analysis, "Resume analysis retrieved")


# ---------------------------------------------------------------------------
# New onboarding endpoints
# ---------------------------------------------------------------------------

@router.get("/onboarding-status")
def onboarding_status(current_user: dict = Depends(get_current_user)):
    """Return whether the user has a resume and whether onboarding is complete."""
    user_id = current_user.get("id")
    status = get_onboarding_status(user_id)
    return success_response(status, "Onboarding status retrieved")


@router.get("/onboarding-report")
def onboarding_report(current_user: dict = Depends(get_current_user)):
    """
    Generate and return the full post-registration onboarding report for the
    current user, including skill gap analysis and a personalised learning plan.
    """
    user_id = current_user.get("id")
    report = generate_onboarding_report(user_id)
    return success_response(report, "Onboarding report generated")


@router.post("/onboarding-complete")
def complete_onboarding(current_user: dict = Depends(get_current_user)):
    """Mark the current user's onboarding as complete."""
    user_id = current_user.get("id")
    mark_onboarding_complete(user_id)
    return success_response({}, "Onboarding marked as complete")


@router.get("/learning-progress")
def learning_progress(current_user: dict = Depends(get_current_user)):
    return success_response(get_learning_progress(current_user.get("id")), "Learning progress retrieved")


@router.put("/learning-progress")
def save_learning_progress(update: LearningProgressUpdate, current_user: dict = Depends(get_current_user)):
    progress = update_learning_progress(current_user.get("id"), update.completed_skills)
    return success_response(progress, "Learning progress saved")
