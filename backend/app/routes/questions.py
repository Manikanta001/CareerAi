from fastapi import APIRouter, Query
from typing import Optional
from app.database.mongodb import get_database
from app.data.mock_content import MOCK_QUESTIONS
from app.data.company_patterns import COMPANY_QUESTIONS
from app.utils.helpers import success_response

router = APIRouter(prefix="/questions", tags=["MCQ Engine"])

@router.get("")
def get_questions(
    subject: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100)
):
    db = get_database()
    query = {}
    if subject and subject != "All":
        query["subject"] = subject
    if topic and topic != "All":
        query["topic"] = topic
    if difficulty and difficulty != "All":
        query["difficulty"] = difficulty
    if company and company != "All":
        query["company"] = company

    if db is not None:
        questions = list(db.questions.find(query).limit(limit))
        for q in questions:
            q["id"] = str(q["_id"])
            del q["_id"]
        if questions:
            return success_response(questions, "Questions retrieved")

    # Keep demo mode behavior identical to database mode: filters and limits
    # must still be honored when MongoDB has no matching records.
    filtered = [
        question for question in [*MOCK_QUESTIONS, *COMPANY_QUESTIONS]
        if (not subject or subject == "All" or question["subject"] == subject)
        and (not topic or topic == "All" or question["topic"] == topic)
        and (not difficulty or difficulty == "All" or question["difficulty"] == difficulty)
        and (not company or company == "All" or question.get("company") == company)
    ]
    return success_response(filtered[:limit], "Questions retrieved")
