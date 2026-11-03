from pydantic import BaseModel, Field
from typing import List, Optional

class CareerSchema(BaseModel):
    title: str
    description: str
    required_skills: List[str]
    preferred_skills: List[str] = Field(default_factory=list)
    recommended_education: str = "B.Tech / B.E. / B.Sc in CS or related field"
    important_subjects: List[str] = Field(default_factory=list)
    difficulty: str = "Medium"
    average_readiness_requirements: str = "Proficiency in core language + 2 frameworks + basic DSA"
    learning_resources: List[dict] = Field(default_factory=list)
    project_recommendations: List[str] = Field(default_factory=list)
