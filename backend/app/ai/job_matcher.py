from typing import List, Dict, Any

def calculate_job_match(user_skills: List[str], job: Dict[str, Any]) -> Dict[str, Any]:
    user_skills_set = set(s.lower() for s in user_skills)
    required = job.get("required_skills", [])
    req_set = set(s.lower() for s in required)
    
    if not req_set or not user_skills_set:
        match_pct = None
        matched = []
        missing = []
    else:
        matched_set = user_skills_set.intersection(req_set)
        missing_set = req_set - user_skills_set
        
        matched = [s for s in required if s.lower() in matched_set]
        missing = [s for s in required if s.lower() in missing_set]
        
        match_pct = round((len(matched_set) / len(req_set)) * 100, 1)

    job_copy = dict(job)
    job_copy["match_percentage"] = min(98.0, match_pct) if match_pct is not None else None
    job_copy["matched_skills"] = matched
    job_copy["missing_skills"] = missing
    return job_copy

def match_jobs_for_user(user_skills: List[str], jobs_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    results = [calculate_job_match(user_skills, job) for job in jobs_list]
    results.sort(key=lambda x: x.get("match_percentage") or 0, reverse=True)
    return results
