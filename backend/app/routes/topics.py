from fastapi import APIRouter, Depends, HTTPException
from app.database.mongodb import get_database
from app.utils.helpers import success_response

router = APIRouter(prefix="/topics", tags=["Learning System"])

@router.get("/{topic_id}/lessons")
def get_topic_lessons(topic_id: str):
    db = get_database()
    if db is not None:
        lessons = list(db.lessons.find({"topic_id": topic_id}))
        for l in lessons:
            l["id"] = str(l["_id"])
            del l["_id"]
        if lessons:
            return success_response(lessons, "Lessons for topic retrieved")

    lessons_mock = [
        {
            "id": "les1",
            "topic_id": topic_id,
            "title": "Core Concepts & Formulas",
            "estimated_time": "15 mins",
            "difficulty": "Easy"
        },
        {
            "id": "les2",
            "topic_id": topic_id,
            "title": "Solved Shortcut Tricks & Examples",
            "estimated_time": "20 mins",
            "difficulty": "Medium"
        }
    ]
    return success_response(lessons_mock, "Lessons retrieved")
