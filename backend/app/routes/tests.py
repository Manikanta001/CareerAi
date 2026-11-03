from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.middleware.auth import get_current_user
from app.schemas.test import TestSubmissionSchema
from app.services.test_service import get_all_tests, evaluate_test_submission
from app.database.mongodb import get_database
from app.routes.questions import get_questions
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
    
    # Fetch questions for test
    qs = get_questions(limit=test.get("total_questions", 30)).get("data", [])
    
    res = dict(test)
    res["questions"] = qs
    return success_response(res, "Mock test data loaded")

@router.post("/{test_id}/submit")
def submit_test(test_id: str, submission: TestSubmissionSchema, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    submission.test_id = test_id
    result = evaluate_test_submission(user_id, submission)
    return success_response(result, "Test submitted and evaluated successfully")

