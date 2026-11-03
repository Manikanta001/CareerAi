from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class TestConfig(BaseModel):
    title: str
    duration_minutes: int = 60
    total_questions: int = 50
    sections: List[dict] = Field(default_factory=list)
    negative_marking: float = 0.25

class TestSubmissionSchema(BaseModel):
    test_id: str
    time_taken_seconds: int
    answers: Dict[str, int]  # question_id -> selected_option_index
