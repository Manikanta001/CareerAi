from typing import Dict, Any, List
from app.database.mongodb import get_database

def get_user_performance_summary(user_id: str) -> Dict[str, Any]:
    db = get_database()
    
    attempts = []
    if db is not None:
        attempts = list(db.test_attempts.find({"user_id": user_id}).sort("submitted_at", -1))
        
    if not attempts:
        # Default mock metrics for new candidate
        return {
            "career_readiness_score": 72.0,
            "resume_score": 78,
            "placement_test_score": 68.0,
            "learning_progress": 61.0,
            "total_questions_solved": 342,
            "overall_accuracy": 74.5,
            "total_tests_taken": 3,
            "readiness_breakdown": {
                "Technical Skills": 24,  # out of 30
                "Placement Tests": 14,  # out of 20
                "DSA": 10,             # out of 15
                "Projects": 8,          # out of 10
                "Resume": 8,            # out of 10
                "Certifications": 3,    # out of 5
                "Interview Prep": 5     # out of 10
            },
            "subject_performance": {
                "Quantitative Aptitude": 80,
                "Logical Reasoning": 65,
                "Verbal Ability": 85,
                "Programming": 70,
                "DBMS": 50,
                "Operating Systems": 60,
                "Computer Networks": 65
            },
            "weak_topics": ["SQL Joins", "Normalization", "Dynamic Programming", "Probability"],
            "strong_topics": ["Java OOP", "Percentages", "Sentence Correction", "Stack & Queue"],
            "score_trend": [
                {"date": "Test 1", "score": 62},
                {"date": "Test 2", "score": 66},
                {"date": "Test 3", "score": 72}
            ]
        }

    total_tests = len(attempts)
    avg_score = round(sum(a.get("percentage", 0) for a in attempts) / total_tests, 1)
    avg_acc = round(sum(a.get("accuracy", 0) for a in attempts) / total_tests, 1)

    all_weak = []
    for a in attempts:
        all_weak.extend(a.get("weak_topics", []))
    unique_weak = list(set(all_weak))[:5]

    score_trend = [
        {"date": f"Test {i+1}", "score": a.get("percentage", 0)}
        for i, a in enumerate(reversed(attempts[:6]))
    ]

    return {
        "career_readiness_score": min(98.0, round(0.4 * avg_score + 0.3 * 80 + 0.3 * avg_acc, 1)),
        "resume_score": 78,
        "placement_test_score": avg_score,
        "learning_progress": 65.0,
        "total_questions_solved": sum(a.get("correct_answers", 0) + a.get("wrong_answers", 0) for a in attempts),
        "overall_accuracy": avg_acc,
        "total_tests_taken": total_tests,
        "readiness_breakdown": {
            "Technical Skills": 22,
            "Placement Tests": int(0.2 * avg_score),
            "DSA": 11,
            "Projects": 8,
            "Resume": 8,
            "Certifications": 3,
            "Interview Prep": 6
        },
        "subject_performance": attempts[0].get("subject_breakdown", {
            "Aptitude": 75, "Reasoning": 65, "Programming": 70, "DBMS": 55
        }),
        "weak_topics": unique_weak or ["SQL Joins", "Normalization", "Paging"],
        "strong_topics": ["Java OOP", "Percentages", "Arrays"],
        "score_trend": score_trend
    }
