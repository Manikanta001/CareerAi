import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.data.mock_content import MOCK_CORRECT_ANSWERS, MOCK_QUESTIONS


def test_demo_question_bank_is_well_formed():
    assert len(MOCK_QUESTIONS) >= 20
    assert len(MOCK_CORRECT_ANSWERS) == len(MOCK_QUESTIONS)
    for question in MOCK_QUESTIONS:
        assert question["id"] in MOCK_CORRECT_ANSWERS
        assert 0 <= question["correct_answer"] < len(question["options"])


def test_demo_question_bank_has_multiple_subjects_and_difficulties():
    assert len({q["subject"] for q in MOCK_QUESTIONS}) >= 8
    assert {q["difficulty"] for q in MOCK_QUESTIONS} == {"Easy", "Medium"}
