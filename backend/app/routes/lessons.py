from fastapi import APIRouter, Depends, HTTPException
from app.database.mongodb import get_database
from app.utils.helpers import success_response

router = APIRouter(prefix="/lessons", tags=["Learning System"])

@router.get("/{lesson_id}")
def get_lesson_by_id(lesson_id: str):
    db = get_database()
    if db is not None:
        try:
            from bson import ObjectId
            lesson = db.lessons.find_one({"_id": ObjectId(lesson_id)})
            if lesson:
                lesson["id"] = str(lesson["_id"])
                del lesson["_id"]
                return success_response(lesson, "Lesson details retrieved")
        except Exception:
            pass

    # Fallback lesson payload
    mock_lesson = {
        "id": lesson_id,
        "title": "SQL Normalization (1NF, 2NF, 3NF, BCNF)",
        "subject": "DBMS",
        "topic": "Normalization",
        "difficulty": "Medium",
        "estimated_learning_time": "25 mins",
        "explanation": "Normalization is the process of organizing database tables to reduce data redundancy and eliminate update/deletion anomalies.",
        "key_concepts": [
            "1NF: Atomic values in columns, no repeating groups.",
            "2NF: In 1NF and no partial dependencies on candidate keys.",
            "3NF: In 2NF and no transitive dependencies.",
            "BCNF: Strict version of 3NF where for X -> Y, X must be a super key."
        ],
        "examples": [
            "Decomposing Student_Course table into Student table and Course table with StudentID foreign key."
        ],
        "formulas": [
            "Functional Dependency: X -> Y means X uniquely determines Y."
        ],
        "common_mistakes": [
            "Confusing partial dependency (part of composite key) with transitive dependency (non-key attribute)."
        ],
        "practice_questions": [
            "If R(A,B,C,D) has AB -> C and C -> D, what is the highest normal form?"
        ]
    }
    return success_response(mock_lesson, "Lesson details retrieved")
