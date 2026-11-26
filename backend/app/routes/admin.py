from datetime import datetime, timezone
from urllib.parse import urlparse
from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Dict, Any
from app.middleware.auth import require_admin, get_current_user
from app.database.mongodb import get_database
from app.utils.helpers import success_response, parse_json_objectable
from bson import ObjectId
from app.schemas.job import JobSchema

router = APIRouter(prefix="/admin", tags=["Admin Panel"])
updates_router = APIRouter(prefix="/updates", tags=["Updates"])


def _clean_url(value: str) -> str:
    url = value.strip()
    parsed = urlparse(url)
    if parsed.scheme not in {"https", "http"} or not parsed.netloc:
        raise HTTPException(status_code=422, detail="Enter a valid http or https URL")
    return url


def _serialize_many(cursor):
    items = list(cursor)
    for item in items:
        item["id"] = str(item.pop("_id"))
    return items


@router.get("/company-links")
def get_company_links(admin: dict = Depends(require_admin)):
    return success_response(_serialize_many(get_database().company_links.find({}).sort("created_at", -1)))


@router.post("/company-links")
def create_company_link(payload: dict = Body(...), admin: dict = Depends(require_admin)):
    name = str(payload.get("name", "")).strip()
    url = str(payload.get("url", "")).strip()
    description = str(payload.get("description", "")).strip()
    if not name or len(name) > 100 or not url:
        raise HTTPException(status_code=422, detail="Company name and URL are required")
    doc = {"name": name, "url": _clean_url(url), "description": description[:500], "created_at": datetime.now(timezone.utc)}
    result = get_database().company_links.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return success_response(doc, "Company link added")


@router.delete("/company-links/{link_id}")
def delete_company_link(link_id: str, admin: dict = Depends(require_admin)):
    if not ObjectId.is_valid(link_id):
        raise HTTPException(status_code=400, detail="Invalid company link ID")
    if not get_database().company_links.delete_one({"_id": ObjectId(link_id)}).deleted_count:
        raise HTTPException(status_code=404, detail="Company link not found")
    return success_response({"id": link_id}, "Company link removed")


@router.get("/announcements")
def get_admin_announcements(admin: dict = Depends(require_admin)):
    return success_response(_serialize_many(get_database().announcements.find({}).sort("created_at", -1)))


@router.post("/announcements")
def create_announcement(payload: dict = Body(...), admin: dict = Depends(require_admin)):
    title = str(payload.get("title", "")).strip()
    body = str(payload.get("body", "")).strip()
    if not title or len(title) > 120 or not body or len(body) > 2000:
        raise HTTPException(status_code=422, detail="Title (1–120 chars) and message (1–2000 chars) are required")
    doc = {"title": title, "body": body, "active": True, "created_at": datetime.now(timezone.utc), "created_by": str(admin.get("id", ""))}
    result = get_database().announcements.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return success_response(doc, "Update published to all users")


@router.delete("/announcements/{announcement_id}")
def delete_announcement(announcement_id: str, admin: dict = Depends(require_admin)):
    if not ObjectId.is_valid(announcement_id):
        raise HTTPException(status_code=400, detail="Invalid announcement ID")
    if not get_database().announcements.delete_one({"_id": ObjectId(announcement_id)}).deleted_count:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return success_response({"id": announcement_id}, "Announcement removed")


@updates_router.get("")
def get_announcements_for_users(user: dict = Depends(get_current_user)):
    return success_response(_serialize_many(get_database().announcements.find({"active": True}).sort("created_at", -1).limit(20)))


@updates_router.get("/company-links")
def get_company_links_for_users(user: dict = Depends(get_current_user)):
    return success_response(_serialize_many(get_database().company_links.find({}).sort("created_at", -1)))


@router.patch("/users/{user_id}/role")
def update_user_role(user_id: str, payload: dict = Body(...), admin: dict = Depends(require_admin)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    role = str(payload.get("role", "")).upper()
    if role not in {"ADMIN", "USER"}:
        raise HTTPException(status_code=422, detail="Role must be USER or ADMIN")
    if user_id == str(admin.get("id")) and role != "ADMIN":
        raise HTTPException(status_code=400, detail="You cannot remove your own admin access")
    result = get_database().users.update_one({"_id": ObjectId(user_id)}, {"$set": {"role": role}})
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="User not found")
    return success_response({"id": user_id, "role": role}, "User role updated")


@router.delete("/users/{user_id}")
def delete_user(user_id: str, admin: dict = Depends(require_admin)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    if user_id == str(admin.get("id")):
        raise HTTPException(status_code=400, detail="You cannot delete your own account")
    db = get_database()
    if not db.users.find_one({"_id": ObjectId(user_id)}, {"_id": 1}):
        raise HTTPException(status_code=404, detail="User not found")
    db.profiles.delete_many({"user_id": user_id})
    db.resumes.delete_many({"user_id": user_id})
    db.test_attempts.delete_many({"user_id": user_id})
    db.users.delete_one({"_id": ObjectId(user_id)})
    return success_response({"id": user_id}, "User account deleted")

@router.get("/users")
def get_users(admin: dict = Depends(require_admin)):
    db = get_database()
    users = list(db.users.find({}, {"password": 0}))
    for u in users:
        u["id"] = str(u["_id"])
        del u["_id"]
    return success_response(users, "Users list retrieved")

@router.get("/careers")
def get_managed_careers(admin: dict = Depends(require_admin)):
    db = get_database()
    careers = list(db.careers.find({}))
    for career in careers:
        career["id"] = str(career.pop("_id"))
    return success_response(careers, "Managed careers retrieved")

@router.get("/jobs")
def get_managed_jobs(admin: dict = Depends(require_admin)):
    db = get_database()
    jobs = list(db.jobs.find({}))
    for job in jobs:
        job["id"] = str(job.pop("_id"))
    return success_response(jobs, "Managed job listings retrieved")

@router.get("/metrics")
def get_admin_metrics(admin: dict = Depends(require_admin)):
    db = get_database()
    return success_response({
        "careers": db.careers.count_documents({}),
        "jobs": db.jobs.count_documents({}),
        "questions": db.questions.count_documents({}),
        "announcements": db.announcements.count_documents({"active": True}),
        "company_links": db.company_links.count_documents({}),
    }, "Admin metrics retrieved")

@router.post("/careers")
def create_career(career_data: dict = Body(...), admin: dict = Depends(require_admin)):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database is unavailable")
    res = db.careers.insert_one(career_data)
    career_data["id"] = str(res.inserted_id)
    return success_response(career_data, "Career created")

@router.delete("/careers/{career_id}")
def delete_career(career_id: str, admin: dict = Depends(require_admin)):
    db = get_database()
    if not ObjectId.is_valid(career_id):
        raise HTTPException(status_code=400, detail="Invalid career ID")
    result = db.careers.delete_one({"_id": ObjectId(career_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Career not found")
    return success_response({"id": career_id}, "Career deleted")

@router.post("/questions")
def create_question(q_data: dict = Body(...), admin: dict = Depends(require_admin)):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database is unavailable")
    res = db.questions.insert_one(q_data)
    q_data["id"] = str(res.inserted_id)
    return success_response(q_data, "Question created")

@router.delete("/questions/{question_id}")
def delete_question(question_id: str, admin: dict = Depends(require_admin)):
    db = get_database()
    if not ObjectId.is_valid(question_id):
        raise HTTPException(status_code=400, detail="Invalid question ID")
    result = db.questions.delete_one({"_id": ObjectId(question_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Question not found")
    return success_response({"id": question_id}, "Question deleted")

@router.post("/jobs")
def create_job(job_data: JobSchema, admin: dict = Depends(require_admin)):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database is unavailable")
    job_doc = job_data.model_dump()
    res = db.jobs.insert_one(job_doc)
    job_doc["id"] = str(res.inserted_id)
    return success_response(job_doc, "Job created")

@router.delete("/jobs/{job_id}")
def delete_job(job_id: str, admin: dict = Depends(require_admin)):
    db = get_database()
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid job ID")
    result = db.jobs.delete_one({"_id": ObjectId(job_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return success_response({"id": job_id}, "Job deleted")
