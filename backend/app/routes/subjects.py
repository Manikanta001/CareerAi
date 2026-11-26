from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database.mongodb import get_database
from app.utils.helpers import success_response
from bson import ObjectId

router = APIRouter(prefix="/subjects", tags=["Learning System"])

DEFAULT_SUBJECTS = [
    {
        "id": "sub1",
        "name": "Quantitative Aptitude",
        "category": "Aptitude",
        "progress_percentage": None,
        "description": "Essential mathematical concepts for campus placement screening tests.",
        "topics_count": 4
    },
    {
        "id": "sub2",
        "name": "Logical Reasoning",
        "category": "Aptitude",
        "progress_percentage": None,
        "description": "Pattern recognition, series, puzzles, and logical statements.",
        "topics_count": 4
    },
    {
        "id": "sub3",
        "name": "Verbal Ability",
        "category": "Aptitude",
        "progress_percentage": None,
        "description": "English grammar, vocabulary, reading comprehension, and sentence correction.",
        "topics_count": 4
    },
    {
        "id": "sub4",
        "name": "Programming Fundamentals (C, C++, Java, Python)",
        "category": "Technical",
        "progress_percentage": None,
        "description": "Syntax, control flow, pointers, memory, and language specific features.",
        "topics_count": 4
    },
    {
        "id": "sub5",
        "name": "Data Structures & Algorithms",
        "category": "Technical",
        "progress_percentage": None,
        "description": "Arrays, Strings, Linked Lists, Trees, Graphs, Sorting, Dynamic Programming.",
        "topics_count": 4
    },
    {
        "id": "sub6",
        "name": "Object-Oriented Programming (OOP)",
        "category": "Technical",
        "progress_percentage": None,
        "description": "Classes, Objects, Encapsulation, Inheritance, Polymorphism, Abstraction.",
        "topics_count": 4
    },
    {
        "id": "sub7",
        "name": "Database Management Systems (DBMS)",
        "category": "Technical",
        "progress_percentage": None,
        "description": "ER Diagram, SQL Queries, Joins, Normalization, ACID Transactions.",
        "topics_count": 4
    },
    {
        "id": "sub8",
        "name": "Operating Systems (OS)",
        "category": "Technical",
        "progress_percentage": None,
        "description": "Process Scheduling, Deadlocks, Memory Management, Paging, Virtual Memory.",
        "topics_count": 4
    },
    {
        "id": "sub9",
        "name": "Computer Networks (CN)",
        "category": "Technical",
        "progress_percentage": None,
        "description": "OSI Layer, TCP/IP Model, HTTP/HTTPS, IP Addressing, Routing Protocols.",
        "topics_count": 4
    },
    {
        "id": "sub10",
        "name": "Software Engineering & Testing",
        "category": "Technical",
        "progress_percentage": None,
        "description": "SDLC, Agile Methodology, Test Cases, STLC, Bug Life Cycle.",
        "topics_count": 4
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

    # Subject-aware starter curriculum when an admin has not published topics yet.
    subject_name = subject_id
    try:
        subject = db.subjects.find_one({"_id": ObjectId(subject_id)}, {"name": 1}) if db is not None else None
        subject_name = (subject or {}).get("name", subject_id)
    except Exception:
        defaults = {"sub1": "Quantitative Aptitude", "sub2": "Logical Reasoning", "sub3": "Verbal Ability", "sub4": "Programming Fundamentals (C, C++, Java, Python)", "sub5": "Data Structures & Algorithms", "sub6": "Object-Oriented Programming (OOP)", "sub7": "Database Management Systems (DBMS)", "sub8": "Operating Systems (OS)", "sub9": "Computer Networks (CN)", "sub10": "Software Engineering & Testing"}
        subject_name = defaults.get(subject_id, subject_id)

    topic_map = {
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
    titles = topic_map.get(subject_name.lower(), ["Core Concepts", "Solved Examples", "Practice Problems", "Revision"])
    topics_mock = [
        {"id": f"topic-{subject_id}-{idx + 1}", "subject_id": subject_id, "title": title, "status": "Not Started", "difficulty": "Easy" if idx == 0 else "Medium"}
        for idx, title in enumerate(titles)
    ]
    return success_response(topics_mock, "Topics retrieved")
