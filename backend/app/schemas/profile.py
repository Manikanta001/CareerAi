from pydantic import BaseModel, Field
from typing import List, Optional

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = ""
    location: Optional[str] = ""
    education: Optional[str] = ""
    degree: Optional[str] = ""
    college: Optional[str] = ""
    graduation_year: Optional[int] = None
    cgpa: Optional[float] = None
    technical_skills: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    projects: List[dict] = Field(default_factory=list)
    experience: List[dict] = Field(default_factory=list)
    preferred_career: Optional[str] = "Software Developer"
    preferred_job_type: Optional[str] = "Full Time"
    preferred_location: Optional[str] = "Remote / Flexible"

class ProfileResponse(ProfileUpdate):
    user_id: str
    email: str
