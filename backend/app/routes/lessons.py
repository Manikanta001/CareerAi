from fastapi import APIRouter, Depends, HTTPException
from app.database.mongodb import get_database
from app.utils.helpers import success_response
from app.routes.topics import SUBJECT_TOPICS, _subject_name

router = APIRouter(prefix="/lessons", tags=["Learning System"])

@router.get("/{lesson_id}")
def get_lesson_by_id(lesson_id: str, topic_id: str | None = None, topic_title: str | None = None):
    db = get_database()
    topic_doc = None
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

        try:
            from bson import ObjectId
            if topic_id and ObjectId.is_valid(topic_id):
                topic_doc = db.topics.find_one({"_id": ObjectId(topic_id)})
        except Exception:
            topic_doc = None

    resolved_topic = (topic_doc or {}).get("title") or topic_title
    subject_id = (topic_doc or {}).get("subject_id")
    if not resolved_topic and topic_id and topic_id.startswith("topic-"):
        subject_part, _, topic_index = topic_id[len("topic-"):].rpartition("-")
        if topic_index.isdigit():
            subject_id = subject_part
            subject_title = _subject_name(db, subject_id)
            topic_list = SUBJECT_TOPICS.get(subject_title.lower(), [])
            index = int(topic_index) - 1
            if 0 <= index < len(topic_list):
                resolved_topic = topic_list[index]

    topic_name = resolved_topic or "the selected placement topic"
    subject_title = _subject_name(db, subject_id) if subject_id else "Placement Learning Center"

    # Starter outline for topics without a published lesson.
    starter_lesson = {
        "id": lesson_id,
        "is_sample": True,
        "title": topic_name,
        "subject": subject_title,
        "topic": topic_name,
        "difficulty": "Medium",
        "estimated_learning_time": "25 mins",
        "explanation": f"This is a starter outline for {topic_name}. Define the key terms, identify the main rules or components, work through a topic-specific example, and test an edge case before moving to practice questions.",
        "key_concepts": [
            f"Write a one-sentence definition of {topic_name} in your own words.",
            "List its key terms, rules, or components and explain how they relate.",
            "Check the conditions and edge cases before applying a rule."
        ],
        "examples": [
            f"Choose a small example involving {topic_name}, show each reasoning step, and verify the result."
        ],
        "formulas": [],
        "common_mistakes": [
            "Memorizing a rule without checking when it applies."
        ],
        "practice_questions": [
            f"Explain {topic_name} to a classmate, then apply it to a new example and check one edge case."
        ]
    }
    return success_response(starter_lesson, "Starter lesson outline retrieved")
