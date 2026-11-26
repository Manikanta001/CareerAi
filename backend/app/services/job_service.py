from typing import List, Dict, Any
from app.database.mongodb import get_database
from app.ai.job_matcher import match_jobs_for_user

def get_all_jobs() -> List[dict]:
    db = get_database()
    if db is not None:
        jobs = list(db.jobs.find({}))
        for j in jobs:
            j["id"] = str(j["_id"])
            del j["_id"]
        if jobs:
            return jobs

    # Default seeded jobs fallback
    return [
        {
            "id": "j1",
            "is_sample": True,
            "title": "Graduate Software Engineer 2026",
            "company": "TechCorp Solutions",
            "location": "Bengaluru / Hyderabad (Hybrid)",
            "job_type": "Full-time",
            "experience": "0-1 years",
            "required_skills": ["Java", "Python", "SQL", "OOP", "Git"],
            "preferred_skills": ["FastAPI", "Docker"],
            "description": "Building next-generation microservices and web APIs for enterprise cloud clients.",
            "responsibilities": ["Develop clean backend APIs", "Participate in code reviews", "Write unit tests"],
            "eligibility": "B.Tech/B.E 2025/2026 graduates with 60%+ throughout",
            "application_url": "",
            "posted_date": "2 days ago"
        },
        {
            "id": "j2",
            "is_sample": True,
            "title": "Junior Python & Backend Developer",
            "company": "InnovateAI Labs",
            "location": "Remote (India)",
            "job_type": "Full-time",
            "experience": "0-2 years",
            "required_skills": ["Python", "FastAPI", "MongoDB", "REST API", "Git"],
            "preferred_skills": ["Docker", "Redis"],
            "description": "Design and implement scalable Python FastAPI services connected to MongoDB.",
            "responsibilities": ["Build REST endpoints", "Optimize database queries", "Integrate AI services"],
            "eligibility": "B.Tech CS/IT with strong Python fundamentals",
            "application_url": "",
            "posted_date": "1 day ago"
        },
        {
            "id": "j3",
            "is_sample": True,
            "title": "Frontend React Developer Intern",
            "company": "NextGen Web Systems",
            "location": "Pune / Remote",
            "job_type": "Internship to Full-time",
            "experience": "Fresher",
            "required_skills": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
            "preferred_skills": ["Vite", "Redux"],
            "description": "Construct intuitive user interfaces and dashboards using React and Tailwind CSS.",
            "responsibilities": ["Translate Figma designs to React", "Ensure responsive mobile UI"],
            "eligibility": "Passionate frontend developer graduating 2025-2026",
            "application_url": "",
            "posted_date": "3 days ago"
        }
    ]

def get_recommended_jobs_for_user(user_id: str) -> List[dict]:
    db = get_database()
    user_skills = []
    if db is not None:
        profile = db.profiles.find_one({"user_id": user_id})
        if profile and profile.get("technical_skills"):
            user_skills = profile.get("technical_skills")

    jobs = get_all_jobs()
    return match_jobs_for_user(user_skills, jobs)
