import sys
import os
import pytest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.ai.skill_extractor import extract_skills_from_text
from app.ai.resume_scorer import calculate_resume_score

def test_skill_extractor():
    sample_text = "Experienced Software Engineer with proficiency in Python, FastAPI, React, SQL, MongoDB, and Git."
    skills = extract_skills_from_text(sample_text)
    assert "Python" in skills
    assert "FastAPI" in skills
    assert "React" in skills
    assert "MongoDB" in skills

def test_resume_scorer():
    sample_text = "John Doe john@example.com Education: B.Tech Skills: Python, Java, SQL Projects: Placement Portal"
    sections = {"contact": True, "education": True, "projects": True}
    skills = ["Python", "Java", "SQL"]
    score_data = calculate_resume_score(sample_text, sections, skills)
    assert "overall_score" in score_data
    assert score_data["overall_score"] > 0


def test_resume_scorer_can_reach_100_for_complete_resume():
    sample_text = ("John Doe john@example.com +91 9876543210\n" + "A " * 300)
    sections = {
        "contact": True,
        "education": ["B.Tech"],
        "projects": ["CareerAI project"],
        "experience": ["Software internship"],
        "certifications": ["Cloud certification"],
    }
    skills = ["Python", "FastAPI", "React", "SQL", "MongoDB", "Git", "Docker", "DSA", "Java", "AWS"]
    score_data = calculate_resume_score(sample_text, sections, skills)
    assert score_data["overall_score"] == 100
