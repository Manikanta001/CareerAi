from typing import List, Dict, Any

RESOURCE_MAPPING = {
    "Docker": {"resource": "Docker Beginner Docs & FreeCodeCamp Docker Tutorial", "time": "8 hours", "project": "Containerize a FastAPI & MongoDB Web App"},
    "Kubernetes": {"resource": "Kubernetes Basics Guide & Minikube Hands-on", "time": "12 hours", "project": "Deploy Microservice Cluster with Kube configs"},
    "REST API Design": {"resource": "RESTful Web API Guidelines & FastAPI Docs", "time": "6 hours", "project": "Design CRUD API for E-commerce Backend"},
    "Redis": {"resource": "Redis University & Crash Course", "time": "4 hours", "project": "Add Caching Layer to FastAPI Application"},
    "Authentication": {"resource": "JWT Auth & OAuth2 with FastAPI Tutorial", "time": "5 hours", "project": "Implement Role-based JWT Auth System"},
    "DSA": {"resource": "NeetCode 150 & GeeksforGeeks DSA Sheet", "time": "40 hours", "project": "Solve 50 Essential Array/Graph LeetCode Problems"},
    "SQL": {"resource": "SQLZoo & Mode Analytics SQL Tutorial", "time": "10 hours", "project": "Complex Analytical Queries & Normalization"},
    "React": {"resource": "Official React Docs (react.dev) & Scrimba", "time": "20 hours", "project": "Build Interactive Single-Page Dashboard"},
    "FastAPI": {"resource": "FastAPI Official Documentation & Tutorial", "time": "10 hours", "project": "Build High-Performance Async REST API"},
    "MongoDB": {"resource": "MongoDB University M001 Basics", "time": "8 hours", "project": "Design Schema for Placement Portal"},
    "Machine Learning": {"resource": "Coursera ML by Andrew Ng & Kaggle Micro-courses", "time": "30 hours", "project": "Build House Price Prediction Model"}
}

def analyze_skill_gap(user_skills: List[str], required_skills: List[str], target_career: str = "Software Developer") -> Dict[str, Any]:
    user_skills_set = set(s.lower() for s in user_skills)
    
    analysis = []
    acquired_count = 0
    
    for req_skill in required_skills:
        req_lower = req_skill.lower()
        if req_lower in user_skills_set:
            acquired_count += 1
            analysis.append({
                "skill": req_skill,
                "status": "Strong",
                "importance": "High",
                "recommended_resource": "Maintain practice via advanced projects.",
                "estimated_learning_time": "Completed",
                "related_project": "Completed"
            })
        else:
            resource_info = RESOURCE_MAPPING.get(req_skill, {
                "resource": f"Official {req_skill} Documentation & Crash Course",
                "time": "10 hours",
                "project": f"Build a practical mini-project applying {req_skill}"
            })
            analysis.append({
                "skill": req_skill,
                "status": "Needs Improvement" if any(req_lower in s for s in user_skills_set) else "Missing",
                "importance": "Critical" if req_skill in required_skills[:3] else "High",
                "recommended_resource": resource_info["resource"],
                "estimated_learning_time": resource_info["time"],
                "related_project": resource_info["project"]
            })

    readiness_percentage = round((acquired_count / len(required_skills)) * 100, 1) if required_skills else 50.0

    return {
        "target_career": target_career,
        "readiness_percentage": readiness_percentage,
        "acquired_skills_count": acquired_count,
        "total_required_skills": len(required_skills),
        "gap_analysis": analysis
    }
