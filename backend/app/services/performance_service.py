from typing import Dict, Any

from app.database.mongodb import get_database


def _get_resume_score(db, user_id: str):
    resume = db.resumes.find_one({"user_id": user_id}, {"analysis.overall_score": 1})
    analysis = (resume or {}).get("analysis") or {}
    return analysis.get("overall_score")


def get_user_performance_summary(user_id: str) -> Dict[str, Any]:
    db = get_database()
    resume_score = _get_resume_score(db, user_id)
    attempts = list(db.test_attempts.find({"user_id": user_id}).sort("submitted_at", -1))

    if not attempts:
        return {
            "career_readiness_score": None,
            "resume_score": resume_score,
            "placement_test_score": None,
            "learning_progress": 0.0,
            "total_questions_solved": 0,
            "overall_accuracy": None,
            "total_tests_taken": 0,
            "readiness_breakdown": {},
            "subject_performance": {},
            "weak_topics": [],
            "strong_topics": [],
            "score_trend": []
        }

    total_tests = len(attempts)
    avg_score = round(sum(a.get("percentage", 0) for a in attempts) / total_tests, 1)
    avg_acc = round(sum(a.get("accuracy", 0) for a in attempts) / total_tests, 1)

    all_weak = []
    for attempt in attempts:
        all_weak.extend(attempt.get("weak_topics", []))
    unique_weak = list(dict.fromkeys(all_weak))[:5]

    score_trend = [
        {"date": f"Test {i + 1}", "score": attempt.get("percentage", 0)}
        for i, attempt in enumerate(reversed(attempts[:6]))
    ]

    return {
        "career_readiness_score": min(98.0, round((0.4 * avg_score + 0.3 * avg_acc) / 0.7, 1)),
        "resume_score": resume_score,
        "placement_test_score": avg_score,
        "learning_progress": 0.0,
        "total_questions_solved": sum(
            a.get("correct_answers", 0) + a.get("wrong_answers", 0) for a in attempts
        ),
        "overall_accuracy": avg_acc,
        "total_tests_taken": total_tests,
        "readiness_breakdown": {"Placement Tests": round(avg_score, 1)},
        "subject_performance": attempts[0].get("subject_breakdown", {}),
        "weak_topics": unique_weak,
        "strong_topics": [],
        "score_trend": score_trend
    }
