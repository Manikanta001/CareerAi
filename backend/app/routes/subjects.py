from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database.mongodb import get_database
from app.utils.helpers import success_response

router = APIRouter(prefix="/subjects", tags=["Learning System"])

DEFAULT_SUBJECTS = [
    {
        "id": "sub1",
        "name": "Quantitative Aptitude",
        "category": "Aptitude",
        "progress_percentage": 65.0,
        "description": "Essential mathematical concepts for campus placement screening tests.",
        "topics_count": 15
    },
    {
        "id": "sub2",
        "name": "Logical Reasoning",
        "category": "Aptitude",
        "progress_percentage": 70.0,
        "description": "Pattern recognition, series, puzzles, and logical statements.",
        "topics_count": 10
    },
    {
        "id": "sub3",
        "name": "Verbal Ability",
        "category": "Aptitude",
        "progress_percentage": 85.0,
        "description": "English grammar, vocabulary, reading comprehension, and sentence correction.",
        "topics_count": 8
    },
    {
        "id": "sub4",
        "name": "Programming Fundamentals (C, C++, Java, Python)",
        "category": "Technical",
        "progress_percentage": 75.0,
        "description": "Syntax, control flow, pointers, memory, and language specific features.",
        "topics_count": 12
    },
    {
        "id": "sub5",
        "name": "Data Structures & Algorithms",
        "category": "Technical",
        "progress_percentage": 50.0,
        "description": "Arrays, Strings, Linked Lists, Trees, Graphs, Sorting, Dynamic Programming.",
        "topics_count": 13
    },
    {
        "id": "sub6",
        "name": "Object-Oriented Programming (OOP)",
        "category": "Technical",
        "progress_percentage": 90.0,
        "description": "Classes, Objects, Encapsulation, Inheritance, Polymorphism, Abstraction.",
        "topics_count": 10
    },
    {
        "id": "sub7",
        "name": "Database Management Systems (DBMS)",
        "category": "Technical",
        "progress_percentage": 55.0,
        "description": "ER Diagram, SQL Queries, Joins, Normalization, ACID Transactions.",
        "topics_count": 10
    },
    {
        "id": "sub8",
        "name": "Operating Systems (OS)",
        "category": "Technical",
        "progress_percentage": 60.0,
        "description": "Process Scheduling, Deadlocks, Memory Management, Paging, Virtual Memory.",
        "topics_count": 9
    },
    {
        "id": "sub9",
        "name": "Computer Networks (CN)",
        "category": "Technical",
        "progress_percentage": 65.0,
        "description": "OSI Layer, TCP/IP Model, HTTP/HTTPS, IP Addressing, Routing Protocols.",
        "topics_count": 8
    },
    {
        "id": "sub10",
        "name": "Software Engineering & Testing",
        "category": "Technical",
        "progress_percentage": 80.0,
        "description": "SDLC, Agile Methodology, Test Cases, STLC, Bug Life Cycle.",
        "topics_count": 9
    }
]

@router.get("")
def list_subjects():
    db = get_database()
    if db is not None:
        subs = list(db.subjects.find({}))
        for s in subs:
            s["id"] = str(s["_id"])
            del s["_id"]
        if subs:
            return success_response(subs, "Subjects retrieved")
    return success_response(DEFAULT_SUBJECTS, "Subjects retrieved")

@router.get("/{subject_id}/topics")
def get_subject_topics(subject_id: str):
    db = get_database()
    if db is not None:
        topics = list(db.topics.find({"subject_id": subject_id}))
        for t in topics:
            t["id"] = str(t["_id"])
            del t["_id"]
        if topics:
            return success_response(topics, "Subject topics retrieved")

    # Sample topics fallback
    topics_mock = [
        {"id": "top1", "subject_id": subject_id, "title": "Percentages", "status": "Completed", "difficulty": "Easy"},
        {"id": "top2", "subject_id": subject_id, "title": "Profit and Loss", "status": "Completed", "difficulty": "Medium"},
        {"id": "top3", "subject_id": subject_id, "title": "Time & Work", "status": "In Progress", "difficulty": "Medium"},
        {"id": "top4", "subject_id": subject_id, "title": "Probability", "status": "Locked", "difficulty": "Hard"}
    ]
    return success_response(topics_mock, "Topics retrieved")
