from fastapi import APIRouter, Depends, UploadFile, File
from app.middleware.auth import get_current_user
from app.services.resume_service import process_resume_upload, get_latest_resume_analysis
from app.utils.helpers import success_response

router = APIRouter(prefix="/resume", tags=["Resume Analyzer"])

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
