from typing import List, Dict, Any

# Lightweight skill-overlap scoring keeps recommendations available without
# downloading a machine-learning model during setup.
def calculate_match_score(user_skills: List[str], career_req_skills: List[str], career_pref_skills: List[str] = None) -> float:
    if not career_req_skills:
        return 50.0

    user_skills_set = set(s.lower() for s in user_skills)
    req_set = set(s.lower() for s in career_req_skills)
    pref_set = set(s.lower() for s in (career_pref_skills or []))

    matched_req = user_skills_set.intersection(req_set)
    matched_pref = user_skills_set.intersection(pref_set)

    req_score = (len(matched_req) / len(req_set)) * 80.0 if req_set else 0
    pref_score = (len(matched_pref) / len(pref_set)) * 20.0 if pref_set else 20.0 if not pref_set else 0

    score = req_score + pref_score
    return round(min(98.0, max(25.0, score)), 1)

def match_careers_for_user(user_skills: List[str], careers_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    results = []

    for career in careers_list:
        match_score = calculate_match_score(user_skills, career.get("required_skills", []), career.get("preferred_skills", []))
        career_copy = dict(career)
        career_copy["match_percentage"] = match_score
        results.append(career_copy)

    # Sort descending by match percentage
    results.sort(key=lambda x: x.get("match_percentage", 0), reverse=True)
    return results
