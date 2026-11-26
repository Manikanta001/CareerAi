from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.database.mongodb import get_database
from app.utils.helpers import success_response

router = APIRouter(prefix="/topics", tags=["Learning System"])

SUBJECT_TOPICS = {
    "quantitative aptitude": ["Percentages", "Profit and Loss", "Time and Work", "Probability"],
    "logical reasoning": ["Number Series", "Syllogisms", "Blood Relations", "Seating Arrangement"],
    "verbal ability": ["Sentence Correction", "Vocabulary", "Reading Comprehension", "Para Jumbles"],
    "programming fundamentals (c, c++, java, python)": ["Variables and Control Flow", "Functions", "Arrays and Strings", "Object-Oriented Basics"],
    "data structures & algorithms": ["Arrays and Hashing", "Searching and Sorting", "Linked Lists", "Trees and Graphs"],
    "object-oriented programming (oop)": ["Classes and Objects", "Encapsulation", "Inheritance", "Polymorphism"],
    "database management systems (dbms)": ["SQL Queries", "Joins", "Normalization", "Transactions and Indexing"],
    "operating systems (os)": ["Processes and Threads", "CPU Scheduling", "Deadlocks", "Memory Management"],
    "computer networks (cn)": ["OSI and TCP/IP Models", "IP Addressing", "HTTP and HTTPS", "Routing and Transport"],
    "software engineering & testing": ["SDLC and Agile", "Requirements", "Test Cases", "Bug Life Cycle"],
}


def _subject_name(db, subject_id: str) -> str:
    if subject_id.startswith("sub"):
        defaults = {"sub1": "Quantitative Aptitude", "sub2": "Logical Reasoning", "sub3": "Verbal Ability", "sub4": "Programming Fundamentals (C, C++, Java, Python)", "sub5": "Data Structures & Algorithms", "sub6": "Object-Oriented Programming (OOP)", "sub7": "Database Management Systems (DBMS)", "sub8": "Operating Systems (OS)", "sub9": "Computer Networks (CN)", "sub10": "Software Engineering & Testing"}
        return defaults.get(subject_id, subject_id)
    try:
        subject = db.subjects.find_one({"_id": ObjectId(subject_id)}, {"name": 1})
        return (subject or {}).get("name", subject_id)
    except Exception:
        return subject_id

def _topic_name(db, topic_id: str) -> tuple[str, str]:
    """Resolve a topic ID to its display name and parent subject."""
    if topic_id.startswith("topic-"):
        subject_id, _, topic_index = topic_id[len("topic-"):].rpartition("-")
        if topic_index.isdigit():
            subject = _subject_name(db, subject_id)
            topics = SUBJECT_TOPICS.get(subject.lower(), [])
            index = int(topic_index) - 1
            if 0 <= index < len(topics):
                return topics[index], subject
    try:
        topic = db.topics.find_one({"_id": ObjectId(topic_id)}) if db is not None and ObjectId.is_valid(topic_id) else None
        if topic:
            return topic.get("title", "Selected topic"), _subject_name(db, topic.get("subject_id", ""))
    except Exception:
        pass
    return "Selected topic", "Placement Learning Center"

@router.get("/{topic_id}/lessons")
def get_topic_lessons(topic_id: str):
    db = get_database()
    topic_name, subject_name = _topic_name(db, topic_id)
    if db is not None:
        lessons = list(db.lessons.find({"topic_id": topic_id}))
        for l in lessons:
            l["id"] = str(l["_id"])
            del l["_id"]
        if lessons:
            return success_response(lessons, "Lessons for topic retrieved")

    lessons_mock = [
        {
            "id": f"lesson-{topic_id}-1",
            "topic_id": topic_id,
            "topic_title": topic_name,
            "subject": subject_name,
            "title": "Core Concepts and Examples",
            "estimated_time": "15 mins",
            "difficulty": "Easy"
        },
        {
            "id": f"lesson-{topic_id}-2",
            "topic_id": topic_id,
            "topic_title": topic_name,
            "subject": subject_name,
            "title": "Practice Strategies and Common Mistakes",
            "estimated_time": "20 mins",
            "difficulty": "Medium"
        }
    ]
    return success_response(lessons_mock, "Lessons retrieved")
