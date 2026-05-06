from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class ExamMode(str, Enum):
    SURVIVAL = "survival"
    BALANCED = "balanced"
    FULL = "full"

class Priority(str, Enum):
    MUST = "must"
    SHOULD = "should"
    OPTIONAL = "optional"

class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class GeneratePlanRequest(BaseModel):
    subject: str
    examDate: str
    topics: List[str]
    pdfText: Optional[str] = None

class Question(BaseModel):
    question: str
    type: str  # MCQ | coding | theory
    difficulty: Difficulty
    probability: float
    priority: Priority
    solution: str

class GeneratePlanResponse(BaseModel):
    mode: ExamMode
    focusTopics: Optional[List[str]] = None
    strategy: str
    questions: List[Question]
