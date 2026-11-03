from fastapi import APIRouter, Depends, HTTPException
from app.middleware.auth import get_current_user
from app.services.job_service import get_all_jobs, get_recommended_jobs_for_user
from app.utils.helpers import success_response

router = APIRouter(prefix="/jobs", tags=["Job Matching"])

@router.get("")
def list_jobs():
    jobs = get_all_jobs()
    return success_response(jobs, "Jobs list retrieved")

@router.get("/recommended")
def get_recommended_jobs(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    recommended = get_recommended_jobs_for_user(user_id)
    return success_response(recommended, "Job matches calculated")

@router.get("/{job_id}")
def get_job_by_id(job_id: str):
    jobs = get_all_jobs()
    job = next((j for j in jobs if j.get("id") == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
    return success_response(job, "Job details retrieved")
