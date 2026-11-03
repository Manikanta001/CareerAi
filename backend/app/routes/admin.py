from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Dict, Any
from app.middleware.auth import require_admin
from app.database.mongodb import get_database
from app.utils.helpers import success_response, parse_json_objectable
from bson import ObjectId

router = APIRouter(prefix="/admin", tags=["Admin Panel"])

@router.get("/users")
def get_users(admin: dict = Depends(require_admin)):
    db = get_database()
    if db is not None:
        users = list(db.users.find({}, {"password": 0}))
        for u in users:
            u["id"] = str(u["_id"])
            del u["_id"]
        return success_response(users, "Users list retrieved")
    
    # Mock admin view of users
    return success_response([
        {"id": "u1", "name": "System Admin", "email": "admin@careerai.com", "role": "ADMIN"},
        {"id": "u2", "name": "Demo Student", "email": "user@careerai.com", "role": "USER"}
    ], "Users list retrieved")

@router.post("/careers")
def create_career(career_data: dict = Body(...), admin: dict = Depends(require_admin)):
    db = get_database()
    if db is not None:
        res = db.careers.insert_one(career_data)
        career_data["id"] = str(res.inserted_id)
        return success_response(career_data, "Career created")
    return success_response(career_data, "Career created (Mock)")

@router.delete("/careers/{career_id}")
def delete_career(career_id: str, admin: dict = Depends(require_admin)):
    db = get_database()
    if db is not None and ObjectId.is_valid(career_id):
        db.careers.delete_one({"_id": ObjectId(career_id)})
    return success_response({"id": career_id}, "Career deleted")

@router.post("/questions")
def create_question(q_data: dict = Body(...), admin: dict = Depends(require_admin)):
    db = get_database()
    if db is not None:
        res = db.questions.insert_one(q_data)
        q_data["id"] = str(res.inserted_id)
        return success_response(q_data, "Question created")
    return success_response(q_data, "Question created (Mock)")

@router.delete("/questions/{question_id}")
def delete_question(question_id: str, admin: dict = Depends(require_admin)):
    db = get_database()
    if db is not None and ObjectId.is_valid(question_id):
        db.questions.delete_one({"_id": ObjectId(question_id)})
    return success_response({"id": question_id}, "Question deleted")

@router.post("/jobs")
def create_job(job_data: dict = Body(...), admin: dict = Depends(require_admin)):
    db = get_database()
    if db is not None:
        res = db.jobs.insert_one(job_data)
        job_data["id"] = str(res.inserted_id)
        return success_response(job_data, "Job created")
    return success_response(job_data, "Job created (Mock)")

@router.delete("/jobs/{job_id}")
def delete_job(job_id: str, admin: dict = Depends(require_admin)):
    db = get_database()
    if db is not None and ObjectId.is_valid(job_id):
        db.jobs.delete_one({"_id": ObjectId(job_id)})
    return success_response({"id": job_id}, "Job deleted")
