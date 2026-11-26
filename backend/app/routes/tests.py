from fastapi import APIRouter, Depends, HTTPException
from typing import List
from bson import ObjectId
from app.middleware.auth import get_current_user
from app.schemas.test import TestSubmissionSchema
from app.services.test_service import get_all_tests, evaluate_test_submission
from app.database.mongodb import get_database
from app.routes.questions import get_questions
from app.data.company_patterns import get_company_pattern
from app.utils.helpers import success_response

router = APIRouter(prefix="/tests", tags=["Mock Test Engine"])

@router.get("")
def list_tests():
    tests = get_all_tests()
    return success_response(tests, "Mock tests retrieved")

@router.get("/attempts/history")
def get_attempts(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    db = get_database()
    attempts = list(db.test_attempts.find({"user_id": user_id}).sort("submitted_at", -1))
    for attempt in attempts:
        attempt["id"] = str(attempt.pop("_id"))
    return success_response(attempts, "Test history retrieved")

@router.get("/{test_id}")
def get_test_details(test_id: str):
    tests = get_all_tests()
    test = next((t for t in tests if t.get("id") == test_id), None)
    if test is None:
        raise HTTPException(status_code=404, detail="Mock test not found")

    if test.get("company_slug"):
        pattern = get_company_pattern(test["company_slug"])
        if pattern is None:
            raise HTTPException(status_code=404, detail="Company practice questions not found")
        response = dict(test)
        response["questions"] = pattern["questions"]
        return success_response(response, "Company mock test loaded")
    
    db = get_database()
    qs = []
    seen_ids = set()
    total_needed = test.get("total_questions", 20)

    if db is not None and test.get("sections"):
        for sec in test["sections"]:
            sec_name = sec.get("name", "")
            sec_count = sec.get("count", 5)
            # Find matching questions by subject (case-insensitive)
            matching = list(db.questions.find({"subject": {"$regex": f"^{sec_name}", "$options": "i"}}).limit(sec_count))
            for q in matching:
                qid = str(q["_id"])
                if qid not in seen_ids:
                    seen_ids.add(qid)
                    q["id"] = qid
                    del q["_id"]
                    qs.append(q)

    # If sections didn't supply enough or no sections, fill from remaining questions
    if len(qs) < total_needed and db is not None:
        remaining_needed = total_needed - len(qs)
        valid_object_ids = [ObjectId(sid) for sid in seen_ids if ObjectId.is_valid(sid)]
        fallback_query = {"_id": {"$nin": valid_object_ids}} if valid_object_ids else {}
        extra = list(db.questions.find(fallback_query).limit(remaining_needed))
        for q in extra:
            qid = str(q["_id"])
            if qid not in seen_ids:
                seen_ids.add(qid)
                q["id"] = qid
                del q["_id"]
                qs.append(q)

    if not qs:
        qs = get_questions(limit=total_needed).get("data", [])

    res = dict(test)
    res["questions"] = qs
    return success_response(res, "Mock test data loaded")

@router.post("/{test_id}/submit")
def submit_test(test_id: str, submission: TestSubmissionSchema, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    submission.test_id = test_id
    result = evaluate_test_submission(user_id, submission)
    return success_response(result, "Test submitted and evaluated successfully")

