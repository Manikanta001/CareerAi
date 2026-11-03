from typing import List, Dict, Any
from app.database.mongodb import get_database
from app.ai.career_matcher import match_careers_for_user
from app.ai.skill_gap import analyze_skill_gap

def get_all_careers() -> List[dict]:
    db = get_database()
    if db is not None:
        careers = list(db.careers.find({}))
        for c in careers:
            c["id"] = str(c["_id"])
            del c["_id"]
        if careers:
            return careers
    
    # Default fallback list of careers
    return [
        {
            "id": "c1",
            "title": "Software Developer",
            "description": "Designs, develops, tests, and maintains software applications across modern tech stacks.",
            "required_skills": ["Java", "Python", "SQL", "Git", "DSA", "OOP"],
            "preferred_skills": ["Docker", "REST API", "CI/CD"],
            "difficulty": "Medium"
        },
        {
            "id": "c2",
            "title": "Python Developer",
            "description": "Specializes in building Python backends, data automation scripts, and REST services.",
            "required_skills": ["Python", "FastAPI", "MongoDB", "SQL", "Git", "REST API Design"],
            "preferred_skills": ["Docker", "Redis", "Pandas"],
            "difficulty": "Medium"
        },
        {
            "id": "c3",
            "title": "Frontend Developer",
            "description": "Creates rich, interactive user interfaces using modern web technologies.",
            "required_skills": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Git"],
            "preferred_skills": ["TypeScript", "Next.js", "Redux"],
            "difficulty": "Easy"
        },
        {
            "id": "c4",
            "title": "Full Stack Developer",
            "description": "Builds end-to-end web applications covering both client interface and server logic.",
            "required_skills": ["JavaScript", "React", "Node.js", "FastAPI", "MongoDB", "SQL", "Git"],
            "preferred_skills": ["Docker", "AWS", "TypeScript"],
            "difficulty": "Hard"
        },
        {
            "id": "c5",
            "title": "Data Analyst",
            "description": "Analyzes complex datasets to deliver actionable business insights and visual dashboards.",
            "required_skills": ["Python", "SQL", "Pandas", "NumPy", "Power BI", "Excel"],
            "preferred_skills": ["Tableau", "R", "Statistics"],
            "difficulty": "Medium"
        }
    ]

def get_recommended_careers_for_user(user_id: str) -> List[dict]:
    db = get_database()
    user_skills = ["C", "C++", "Java", "Python", "SQL", "Git"]
    
    if db is not None:
        profile = db.profiles.find_one({"user_id": user_id})
        if profile and profile.get("technical_skills"):
            user_skills = profile.get("technical_skills")
            
    all_careers = get_all_careers()
    return match_careers_for_user(user_skills, all_careers)

def get_skill_gap_for_user(user_id: str, career_title: str = None) -> dict:
    db = get_database()
    user_skills = ["C", "C++", "Java", "Python", "SQL", "Git"]
    target_career_title = career_title or "Software Developer"
    
    if db is not None:
        profile = db.profiles.find_one({"user_id": user_id})
        if profile:
            if profile.get("technical_skills"):
                user_skills = profile.get("technical_skills")
            if not career_title and profile.get("preferred_career"):
                target_career_title = profile.get("preferred_career")

    all_careers = get_all_careers()
    target_career = next((c for c in all_careers if c.get("title").lower() == target_career_title.lower()), all_careers[0])
    
    required_skills = target_career.get("required_skills", ["Java", "Python", "SQL", "DSA", "Docker"])
    return analyze_skill_gap(user_skills, required_skills, target_career.get("title"))
