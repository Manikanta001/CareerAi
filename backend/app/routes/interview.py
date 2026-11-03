from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.database.mongodb import get_database
from app.utils.helpers import success_response

router = APIRouter(prefix="/interview", tags=["Interview Preparation"])

DEFAULT_INTERVIEW_QUESTIONS = [
    {
        "id": "iq1",
        "category": "Technical",
        "topic": "OOP",
        "question": "Explain the difference between Abstract Class and Interface in Java.",
        "answer": "An abstract class can have concrete method implementations, member variables, and constructors, allowing single inheritance. An interface (prior to Java 8) contains only method signatures, supports multiple inheritance, and is used to define contract behavior."
    },
    {
        "id": "iq2",
        "category": "Technical",
        "topic": "DBMS",
        "question": "What are ACID properties in Database Management Systems?",
        "answer": "ACID stands for Atomicity (all or nothing), Consistency (preserves database rules), Isolation (concurrent execution without interference), and Durability (committed data survives crashes)."
    },
    {
        "id": "iq3",
        "category": "Behavioral",
        "topic": "HR",
        "question": "Tell me about a time you faced a difficult technical bug under tight deadlines.",
        "answer": "Use the STAR method (Situation, Task, Action, Result). Highlight how you analyzed root cause logs, systematically tested hypotheses, communicated progress, and successfully delivered on time."
    },
    {
        "id": "iq4",
        "category": "HR",
        "topic": "Career Goal",
        "question": "Where do you see yourself in 3 years?",
        "answer": "Focus on growing technical expertise in software architecture, taking ownership of core features, and contributing positively to engineering team culture."
    }
]

@router.get("/questions")
def get_interview_questions(category: Optional[str] = Query(None)):
    if category and category != "All":
        qs = [q for q in DEFAULT_INTERVIEW_QUESTIONS if q["category"].lower() == category.lower()]
    else:
        qs = DEFAULT_INTERVIEW_QUESTIONS
    return success_response(qs, "Interview questions retrieved")
