from fastapi import APIRouter, Depends, Query
from typing import Optional, List
from app.database.mongodb import get_database
from app.utils.helpers import success_response

router = APIRouter(prefix="/questions", tags=["MCQ Engine"])

@router.get("")
def get_questions(
    subject: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    limit: int = 20
):
    db = get_database()
    query = {}
    if subject and subject != "All":
        query["subject"] = subject
    if topic and topic != "All":
        query["topic"] = topic
    if difficulty and difficulty != "All":
        query["difficulty"] = difficulty

    if db is not None:
        questions = list(db.questions.find(query).limit(limit))
        for q in questions:
            q["id"] = str(q["_id"])
            del q["_id"]
        if questions:
            return success_response(questions, "Questions retrieved")

    # Sample practice questions fallback
    mock_questions = [
        {
            "id": "q1",
            "subject": "Java",
            "topic": "OOP",
            "difficulty": "Medium",
            "question": "Which concept allows one interface to have multiple implementations?",
            "options": ["Encapsulation", "Polymorphism", "Abstraction", "Inheritance"],
            "correct_answer": 1,
            "explanation": "Polymorphism allows the same interface to represent different underlying implementations.",
            "marks": 1
        },
        {
            "id": "q2",
            "subject": "DBMS",
            "topic": "SQL",
            "difficulty": "Easy",
            "question": "Which SQL clause is used to filter records after aggregation?",
            "options": ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
            "correct_answer": 1,
            "explanation": "HAVING filters aggregated groups, whereas WHERE filters individual rows prior to grouping.",
            "marks": 1
        },
        {
            "id": "q3",
            "subject": "Quantitative Aptitude",
            "topic": "Percentages",
            "difficulty": "Easy",
            "question": "If A's salary is 25% more than B's salary, by how much percentage is B's salary less than A's?",
            "options": ["20%", "25%", "15%", "30%"],
            "correct_answer": 0,
            "explanation": "Let B = 100 => A = 125. B is 25 less than A. % less = (25/125) * 100 = 20%.",
            "marks": 1
        },
        {
            "id": "q4",
            "subject": "Operating Systems",
            "topic": "Deadlocks",
            "difficulty": "Medium",
            "question": "Which algorithm is used for deadlock avoidance in Operating Systems?",
            "options": ["Round Robin Algorithm", "Banker's Algorithm", "LRU Algorithm", "SJF Algorithm"],
            "correct_answer": 1,
            "explanation": "Banker's algorithm tests for safety by simulating resource allocation for maximum declared claims.",
            "marks": 1
        },
        {
            "id": "q5",
            "subject": "Data Structures",
            "topic": "Trees",
            "difficulty": "Medium",
            "question": "What is the worst-case time complexity of searching in an unbalanced Binary Search Tree (BST)?",
            "options": ["O(log N)", "O(N)", "O(1)", "O(N log N)"],
            "correct_answer": 1,
            "explanation": "In an unbalanced BST (skewed tree), elements form a linear chain, giving worst-case search complexity of O(N).",
            "marks": 1
        }
    ]
    return success_response(mock_questions, "Questions retrieved")
