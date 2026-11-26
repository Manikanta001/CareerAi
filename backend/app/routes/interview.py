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
    },
    {
        "id": "iq5", "category": "Technical", "topic": "DSA · Complexity",
        "question": "What does Big O notation describe? Give an example.",
        "answer": "Big O describes how an algorithm's resource use grows as input size grows, usually focusing on an upper bound. A single pass over n values is O(n); comparing every pair is O(n²). Mention the input size and the operation being counted."
    },
    {
        "id": "iq6", "category": "Technical", "topic": "DSA · Hash Maps",
        "question": "When would you use a hash map instead of searching an array?",
        "answer": "Use a hash map when you need repeated lookups by a key and can trade extra memory for speed. Lookup is average O(1), while scanning an unsorted array is O(n). For example, a map of values to indices supports a one-pass Two Sum solution."
    },
    {
        "id": "iq7", "category": "Technical", "topic": "DSA · Binary Search",
        "question": "What conditions make binary search appropriate, and what is its complexity?",
        "answer": "The search range must have an ordering or monotonic condition that lets each comparison discard half the candidates. Its time complexity is O(log n); iterative binary search uses O(1) extra space. Be careful to update bounds so the interval always shrinks."
    },
    {
        "id": "iq8", "category": "Technical", "topic": "DSA · Stack and Queue",
        "question": "Explain the difference between a stack and a queue, and give one use for each.",
        "answer": "A stack is last-in, first-out, which suits undo history or matching brackets. A queue is first-in, first-out, which suits task scheduling or breadth-first search. Both support insertion and removal in O(1) with a suitable implementation."
    },
    {
        "id": "iq9", "category": "Technical", "topic": "DSA · Trees and Graphs",
        "question": "How does breadth-first search differ from depth-first search?",
        "answer": "BFS explores level by level with a queue and finds a shortest path in an unweighted graph. DFS follows a path deeply before backtracking, usually with recursion or a stack. Both take O(V + E) time when visiting a graph's vertices and edges."
    },
    {
        "id": "iq10", "category": "Technical", "topic": "DBMS · Indexes",
        "question": "What is a database index, and what trade-off does it introduce?",
        "answer": "An index is an auxiliary data structure that helps the database find rows without scanning the whole table. It can speed up reads and joins, but consumes storage and adds work to inserts, updates, and deletes. Index columns that match real query patterns."
    },
    {
        "id": "iq11", "category": "Technical", "topic": "SQL · Joins",
        "question": "What is the difference between INNER JOIN and LEFT JOIN?",
        "answer": "INNER JOIN returns rows with matching keys on both sides. LEFT JOIN returns every row from the left table and fills right-side columns with NULL when there is no match. Choose based on whether unmatched left-side records should remain in the result."
    },
    {
        "id": "iq12", "category": "Technical", "topic": "Operating Systems · Processes",
        "question": "How are a process and a thread different?",
        "answer": "A process has its own address space and operating-system resources. Threads are execution paths inside a process and share that process's memory. Threads can communicate cheaply through shared memory, but shared state needs synchronization."
    },
    {
        "id": "iq13", "category": "Technical", "topic": "Operating Systems · Deadlocks",
        "question": "What is a deadlock, and what are its four necessary conditions?",
        "answer": "A deadlock occurs when processes wait indefinitely for resources held by one another. The necessary conditions are mutual exclusion, hold and wait, no preemption, and circular wait. Preventing at least one condition can prevent deadlock."
    },
    {
        "id": "iq14", "category": "Technical", "topic": "Computer Networks · TCP/UDP",
        "question": "Compare TCP and UDP. When might an application choose each?",
        "answer": "TCP provides an ordered, reliable byte stream with retransmission; UDP sends datagrams without guaranteeing delivery or order. File transfer commonly needs TCP reliability, while latency-sensitive voice or video may use UDP with application-level handling for loss."
    },
    {
        "id": "iq15", "category": "Technical", "topic": "Software Engineering · Testing",
        "question": "How do unit, integration, and end-to-end tests differ?",
        "answer": "Unit tests check a small component in isolation. Integration tests check that connected components work together. End-to-end tests exercise a user flow through the application. A useful suite has many fast unit tests and targeted integration and end-to-end coverage."
    },
    {
        "id": "iq16", "category": "Technical", "topic": "Project Discussion",
        "question": "Walk me through a project you built and one technical decision you made.",
        "answer": "Structure your response as: the user problem, your role, the design, one decision and its trade-off, how you tested it, and the result. Be specific about your own contribution and honest about what you would improve next."
    },
    {
        "id": "iq17", "category": "HR", "topic": "Introduction",
        "question": "Tell me about yourself.",
        "answer": "Use a 60–90 second structure: your current study or role, one or two relevant skills, a project or experience that demonstrates them, and why this opportunity fits your next step. Keep personal details brief and tailor the ending to the role."
    },
    {
        "id": "iq18", "category": "HR", "topic": "Motivation",
        "question": "Why are you interested in this role?",
        "answer": "Connect a real part of the role or product to your interests, then support the connection with a relevant project, course, or experience. Explain what you can contribute and what you hope to learn; avoid relying only on brand name or compensation."
    },
    {
        "id": "iq19", "category": "HR", "topic": "Strengths",
        "question": "What is one of your strengths?",
        "answer": "Name one strength that matters for the role, then give a short example showing how you used it and what changed as a result. Choose evidence from coursework, projects, internships, or team activities rather than making an unsupported claim."
    },
    {
        "id": "iq20", "category": "HR", "topic": "Growth Area",
        "question": "What is an area you are working to improve?",
        "answer": "Choose a genuine, manageable development area. Explain the steps you are taking—such as practice, feedback, or a project—and how you are measuring progress. Avoid disguised strengths or claiming the issue is already solved if it is not."
    },
    {
        "id": "iq21", "category": "Behavioral", "topic": "Teamwork",
        "question": "Tell me about a disagreement you had while working on a team.",
        "answer": "Use STAR: briefly describe the shared goal and disagreement, explain how you listened and compared options against evidence, state the action you took, and finish with the outcome and what you learned. Keep the focus on resolving the work, not blaming someone."
    },
    {
        "id": "iq22", "category": "Behavioral", "topic": "Learning from Failure",
        "question": "Describe a mistake or setback and how you handled it.",
        "answer": "Choose a real example you can discuss openly. Explain the impact, take responsibility for your part, describe how you corrected it, and share the change you made to prevent a repeat. Do not reveal confidential information or blame teammates."
    },
    {
        "id": "iq23", "category": "Behavioral", "topic": "Prioritization",
        "question": "How do you handle several tasks with the same deadline?",
        "answer": "Explain how you clarify deadlines and dependencies, estimate effort, prioritize by impact and urgency, and communicate risks early. Give a real example if possible, including how you adjusted when priorities changed."
    },
    {
        "id": "iq24", "category": "Behavioral", "topic": "Feedback",
        "question": "Tell me about a time you received difficult feedback.",
        "answer": "Describe the feedback without becoming defensive, explain how you clarified and evaluated it, then share the specific action you took and the result. A strong answer shows reflection and follow-through rather than simply agreeing with everything."
    }
]

@router.get("/questions")
def get_interview_questions(category: Optional[str] = Query(None)):
    if category and category.lower() not in {"all", "hr & behavioral"}:
        if category.lower() == "hr":
            qs = [q for q in DEFAULT_INTERVIEW_QUESTIONS if q["category"].lower() in {"hr", "behavioral"}]
        else:
            qs = [q for q in DEFAULT_INTERVIEW_QUESTIONS if q["category"].lower() == category.lower()]
    else:
        qs = DEFAULT_INTERVIEW_QUESTIONS
    return success_response(qs, "Interview questions retrieved")
