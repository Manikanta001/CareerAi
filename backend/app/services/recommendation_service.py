from typing import Dict, Any, List
from datetime import date
from app.services.performance_service import get_user_performance_summary

def get_daily_recommendation_plan(user_id: str) -> Dict[str, Any]:
    perf = get_user_performance_summary(user_id)
    weak_topics = perf.get("weak_topics", ["DBMS Normalization", "SQL Joins", "Probability"])
    
    tasks = [
        {
            "id": 1,
            "title": f"Study {weak_topics[0] if weak_topics else 'DBMS Normalization'}",
            "duration": "30 mins",
            "type": "Lesson",
            "completed": False
        },
        {
            "id": 2,
            "title": f"Practice 15 Questions on {weak_topics[1] if len(weak_topics)>1 else 'Aptitude'}",
            "duration": "25 mins",
            "type": "MCQ Practice",
            "completed": False
        },
        {
            "id": 3,
            "title": "Solve 2 DSA Coding Problems (Arrays & Hash Maps)",
            "duration": "40 mins",
            "type": "Coding",
            "completed": False
        },
        {
            "id": 4,
            "title": "Review Incorrect Answers from Last Mock Test",
            "duration": "20 mins",
            "type": "Review",
            "completed": True
        }
    ]

    return {
        "date": date.today().isoformat(),
        "focus_areas": weak_topics[:3],
        "estimated_total_time": "1 hour 55 mins",
        "tasks": tasks,
        "motivation_quote": "Consistency builds placement confidence. Complete today's plan to boost your readiness score!"
    }
