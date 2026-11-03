from typing import Dict, Any, List

def calculate_resume_score(raw_text: str, sections: Dict[str, Any], extracted_skills: List[str]) -> Dict[str, Any]:
    text_len = len(raw_text.strip())
    
    # Breakdown out of 100
    contact_score = 10 if sections.get("contact") else 4
    education_score = 10 if sections.get("education") else 5
    
    # Skills score (max 20)
    skill_count = len(extracted_skills)
    if skill_count >= 10:
        skills_score = 20
    elif skill_count >= 6:
        skills_score = 16
    elif skill_count >= 3:
        skills_score = 12
    else:
        skills_score = 6

    # Projects score (max 20)
    projects_score = 18 if sections.get("projects") else 8

    # Experience score (max 20)
    experience_score = 16 if sections.get("experience") else 10

    # Certifications score (max 10)
    cert_score = 10 if sections.get("certifications") else 4

    # Formatting / Length score (max 10)
    if 500 <= text_len <= 4000:
        formatting_score = 9
    elif text_len > 4000:
        formatting_score = 7
    else:
        formatting_score = 5

    total_score = contact_score + education_score + skills_score + projects_score + experience_score + cert_score + formatting_score
    total_score = min(100, max(0, total_score))

    suggestions = []
    if contact_score < 10:
        suggestions.append("Add clear contact details (Email, Phone number, LinkedIn/GitHub links).")
    if skill_count < 6:
        suggestions.append("Add more explicit technical skills, tools, and frameworks.")
    if not sections.get("projects"):
        suggestions.append("Add detailed academic or personal projects with technologies used.")
    if not sections.get("certifications"):
        suggestions.append("Include relevant technical certifications or online course completions.")
    if not sections.get("experience"):
        suggestions.append("Mention internships, open-source contributions, or project lead roles.")
    if text_len < 500:
        suggestions.append("Expand section descriptions to detail your responsibilities and achievements.")

    return {
        "overall_score": total_score,
        "section_scores": {
            "Contact Information": f"{contact_score}/10",
            "Education": f"{education_score}/10",
            "Skills": f"{skills_score}/20",
            "Projects": f"{projects_score}/20",
            "Experience": f"{experience_score}/20",
            "Certifications": f"{cert_score}/10",
            "Overall Formatting": f"{formatting_score}/10"
        },
        "extracted_skills": extracted_skills,
        "suggestions": suggestions
    }
