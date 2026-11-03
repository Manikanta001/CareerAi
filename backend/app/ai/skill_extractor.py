import re
from typing import List

# Comprehensive default dictionary of technical skills
SKILL_TAXONOMY = [
    # Programming
    "C", "C++", "Java", "Python", "JavaScript", "TypeScript", "SQL", "HTML", "CSS", "R", "Go", "Rust",
    # Frontend
    "React", "Vue", "Angular", "Next.js", "Bootstrap", "Tailwind CSS", "Redux", "Vite",
    # Backend
    "FastAPI", "Node.js", "Express", "Spring Boot", "Django", "Flask", "ASP.NET",
    # Database
    "MongoDB", "MySQL", "PostgreSQL", "Redis", "Oracle", "SQLite", "Firebase",
    # Data & AI/ML
    "Pandas", "NumPy", "Power BI", "Tableau", "Machine Learning", "Deep Learning", "NLP",
    "TensorFlow", "PyTorch", "scikit-learn", "OpenCV", "Data Analysis",
    # Cloud & DevOps
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git", "GitHub", "CI/CD", "Linux",
    # Testing & Tools
    "Manual Testing", "Selenium", "Automation Testing", "Postman", "Jira", "JUnit",
    # Core Concepts
    "OOP", "DSA", "REST API", "Microservices", "DBMS", "Operating Systems", "Computer Networks"
]

def extract_skills_from_text(raw_text: str) -> List[str]:
    extracted = set()
    text_upper = raw_text.upper()
    
    # Tokenize word boundaries for accuracy
    tokens = set(re.findall(r'\b[A-Za-z0-9+#\.-]+\b', raw_text))

    for skill in SKILL_TAXONOMY:
        # Check case-sensitive or boundaries for short names like C, C++, R
        if skill in ["C", "R", "Go"]:
            pattern = rf'\b{re.escape(skill)}\b'
            if re.search(pattern, raw_text):
                extracted.add(skill)
        elif skill in ["C++", "C#"]:
            if skill in raw_text:
                extracted.add(skill)
        else:
            # Case-insensitive substring/token check
            pattern = rf'\b{re.escape(skill)}\b'
            if re.search(pattern, raw_text, re.IGNORECASE):
                extracted.add(skill)

    return sorted(list(extracted))
