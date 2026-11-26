from datetime import datetime, timezone
from typing import List, Dict, Any
from bson import ObjectId
from fastapi import HTTPException
from app.database.mongodb import get_database
from app.schemas.test import TestSubmissionSchema
from app.data.mock_content import MOCK_CORRECT_ANSWERS
from app.data.company_patterns import COMPANY_QUESTION_ANSWERS, get_company_mock_tests

SCORABLE_MOCK_ANSWERS = {**MOCK_CORRECT_ANSWERS, **COMPANY_QUESTION_ANSWERS}

def get_all_tests() -> List[dict]:
    db = get_database()
    company_tests = get_company_mock_tests()
    if db is not None:
        tests = list(db.mock_tests.find({}))
        for t in tests:
            t["id"] = str(t["_id"])
            del t["_id"]
        if tests:
            known_ids = {test["id"] for test in tests}
            return tests + [test for test in company_tests if test["id"] not in known_ids]

    # Seeded tests fallback
    return [
        {
            "id": "t1",
            "title": "CareerAI Core Skills Mock Test",
            "duration_minutes": 30,
            "total_questions": 20,
            "negative_marking": 0.25,
            "sections": [
                {"name": "Java", "count": 3},
                {"name": "Python", "count": 3},
                {"name": "Data Structures", "count": 3},
                {"name": "DBMS", "count": 3},
                {"name": "Operating Systems", "count": 2},
                {"name": "Computer Networks", "count": 2},
                {"name": "Aptitude", "count": 4},
            ]
        },
        {
            "id": "t2",
            "title": "CareerAI Aptitude & Communication Mock Test",
            "duration_minutes": 20,
            "total_questions": 10,
            "negative_marking": 0.25,
            "sections": [
                {"name": "Quantitative Aptitude", "count": 2},
                {"name": "Logical Reasoning", "count": 2},
                {"name": "Verbal Ability", "count": 2},
                {"name": "Computer Networks", "count": 2},
                {"name": "Data Structures", "count": 2},
            ]
        }
    ] + company_tests

def evaluate_test_submission(user_id: str, submission: TestSubmissionSchema) -> dict:
    db = get_database()
    answers = submission.answers  # dict of q_id -> selected_option index
    selected_test = next((test for test in get_all_tests() if test.get("id") == submission.test_id), {})
    negative_marking = selected_test.get("negative_marking", 0.25)
    
    questions = []
    if db is not None:
        # Load questions from database
        q_ids = [ObjectId(qid) for qid in answers.keys() if ObjectId.is_valid(qid)]
        if q_ids:
            questions = list(db.questions.find({"_id": {"$in": q_ids}}))

    if not questions:
        # Keep demo-question scoring aligned with the sample questions returned by
        # the questions endpoint. Never infer correctness from the chosen index.
        if not answers or any(qid not in SCORABLE_MOCK_ANSWERS for qid in answers):
            raise HTTPException(status_code=400, detail="No scorable questions were submitted")
        score, correct, wrong, skipped = 0, 0, 0, 0
        for q_id, opt in answers.items():
            if opt == SCORABLE_MOCK_ANSWERS[q_id]:
                correct += 1
                score += 1
            elif opt == -1 or opt is None:
                skipped += 1
            else:
                wrong += 1
                score -= negative_marking

        total_q = len(answers) or 1
        accuracy = round((correct / max(1, (correct + wrong))) * 100, 1)
        percentage = round((max(0, score) / total_q) * 100, 1)

        result_doc = {
            "user_id": user_id,
            "test_id": submission.test_id,
            "total_questions": total_q,
            "correct_answers": correct,
            "wrong_answers": wrong,
            "skipped_questions": skipped,
            "score": round(score, 2),
            "percentage": percentage,
            "accuracy": accuracy,
            "time_taken_seconds": submission.time_taken_seconds,
            "submitted_at": datetime.now(timezone.utc),
            "subject_breakdown": {},
            "weak_topics": []
        }

        if db is not None:
            db.test_attempts.insert_one(result_doc)

        return result_doc

    correct, wrong, skipped = 0, 0, 0
    score = 0.0
    subject_correct = {}
    subject_total = {}
    topic_correct = {}
    topic_total = {}

    for q in questions:
        qid_str = str(q["_id"])
        subj = q.get("subject", "General")
        top = q.get("topic", "General")
        
        subject_total[subj] = subject_total.get(subj, 0) + 1
        topic_total[top] = topic_total.get(top, 0) + 1

        selected = answers.get(qid_str)
        if selected is None or selected == -1:
            skipped += 1
        elif selected == q.get("correct_answer"):
            correct += 1
            score += q.get("marks", 1)
            subject_correct[subj] = subject_correct.get(subj, 0) + 1
            topic_correct[top] = topic_correct.get(top, 0) + 1
        else:
            wrong += 1
            score -= negative_marking

    total_q = len(questions)
    accuracy = round((correct / max(1, (correct + wrong))) * 100, 1)
    percentage = round((max(0, score) / max(1, total_q)) * 100, 1)

    subject_breakdown = {}
    for s, tot in subject_total.items():
        corr = subject_correct.get(s, 0)
        subject_breakdown[s] = round((corr / tot) * 100, 1)

    weak_topics = []
    for top, tot in topic_total.items():
        corr = topic_correct.get(top, 0)
        top_acc = (corr / tot) * 100
        if top_acc < 60:
            weak_topics.append(top)

    result_doc = {
        "user_id": user_id,
        "test_id": submission.test_id,
        "total_questions": total_q,
        "correct_answers": correct,
        "wrong_answers": wrong,
        "skipped_questions": skipped,
        "score": round(score, 2),
        "percentage": percentage,
        "accuracy": accuracy,
        "time_taken_seconds": submission.time_taken_seconds,
        "submitted_at": datetime.now(timezone.utc),
        "subject_breakdown": subject_breakdown,
        "weak_topics": weak_topics
    }

    if db is not None:
        db.test_attempts.insert_one(result_doc)

    return result_doc
