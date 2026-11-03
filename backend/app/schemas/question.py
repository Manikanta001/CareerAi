from pydantic import BaseModel, Field
from typing import List, Optional

class QuestionSchema(BaseModel):
    subject: str
    topic: str
    difficulty: str = "Medium"
    question: str
    options: List[str]
    correct_answer: int
    explanation: str
    marks: int = 1
