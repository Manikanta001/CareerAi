from pydantic import BaseModel, Field, field_validator
from urllib.parse import urlparse
from typing import List, Optional

class JobSchema(BaseModel):
    title: str
    company: str
    location: str
    job_type: str = "Full-time"
    experience: str = "0-2 years"
    required_skills: List[str]
    preferred_skills: List[str] = Field(default_factory=list)
    description: str
    responsibilities: List[str] = Field(default_factory=list)
    eligibility: str = "B.Tech/BE candidates graduating 2024-2026"
    application_url: str = ""
    posted_date: str = "Recently"

    @field_validator("application_url")
    @classmethod
    def validate_application_url(cls, value: str) -> str:
        if not value:
            return value
        parsed = urlparse(value)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("Application URL must use http:// or https://")
        return value
