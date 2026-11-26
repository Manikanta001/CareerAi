import logging
from pymongo import ASCENDING, TEXT
from app.database.mongodb import get_database
from app.data.mock_content import MOCK_QUESTIONS

logger = logging.getLogger(__name__)

def create_db_indexes():
    db = get_database()
    if db is None:
        raise RuntimeError("MongoDB is required to initialize database indexes")

    db.users.create_index([("email", ASCENDING)], unique=True)
    db.profiles.create_index([("user_id", ASCENDING)], unique=True)
    db.questions.create_index([("subject", ASCENDING)])
    db.questions.create_index([("topic", ASCENDING)])
    db.questions.create_index([("difficulty", ASCENDING)])
    db.test_attempts.create_index([("user_id", ASCENDING)])
    db.jobs.create_index([("title", TEXT), ("company", TEXT), ("description", TEXT)])
    seed_basic_learning_content(db)
    logger.info("MongoDB indexes verified/created successfully.")


def seed_basic_learning_content(db):
    """Insert the small local starter catalog once so empty databases are usable."""
    if db.questions.count_documents({}) == 0:
        questions = [{key: value for key, value in question.items() if key != "id"} for question in MOCK_QUESTIONS]
        db.questions.insert_many(questions)

    if db.mock_tests.count_documents({}) == 0:
        db.mock_tests.insert_many([
            {
                "title": "CareerAI Core Skills Starter Test",
                "duration_minutes": 20,
                "total_questions": 10,
                "negative_marking": 0.25,
                "sections": [
                    {"name": "Python", "count": 2},
                    {"name": "Java", "count": 2},
                    {"name": "DBMS", "count": 2},
                    {"name": "Data Structures", "count": 2},
                    {"name": "Operating Systems", "count": 2}
                ]
            },
            {
                "title": "CareerAI Aptitude Starter Test",
                "duration_minutes": 15,
                "total_questions": 5,
                "negative_marking": 0.25,
                "sections": [
                    {"name": "Quantitative Aptitude", "count": 2},
                    {"name": "Logical Reasoning", "count": 2},
                    {"name": "Verbal Ability", "count": 1}
                ]
            }
        ])

    if db.subjects.count_documents({}) == 0:
        subjects = sorted({question["subject"] for question in MOCK_QUESTIONS})
        db.subjects.insert_many([
            {
                "name": subject,
                "category": "Aptitude" if subject in {
                    "Quantitative Aptitude", "Logical Reasoning", "Verbal Ability"
                } else "Technical",
                "description": f"Starter practice content for {subject}.",
                "topics_count": len({q["topic"] for q in MOCK_QUESTIONS if q["subject"] == subject})
            }
            for subject in subjects
        ])

    if db.topics.count_documents({}) == 0:
        subject_ids = {subject["name"]: subject["_id"] for subject in db.subjects.find({})}
        topics = []
        for topic in sorted({(q["subject"], q["topic"]) for q in MOCK_QUESTIONS}):
            subject_name, topic_name = topic
            topics.append({
                "subject_id": str(subject_ids[subject_name]),
                "title": topic_name,
                "description": f"Basic {topic_name} concepts and practice for {subject_name}.",
                "difficulty": "Easy",
                "status": "Not Started"
            })
        if topics:
            db.topics.insert_many(topics)
