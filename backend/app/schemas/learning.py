from pydantic import BaseModel, Field


class LearningProgressUpdate(BaseModel):
    completed_skills: list[str] = Field(default_factory=list, max_length=20)
