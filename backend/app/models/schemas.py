from pydantic import BaseModel, field_validator, model_validator
from typing import List, Optional, Dict
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


class QuestionType(str, Enum):
    MCQ = "MCQ"
    CODING = "coding"
    THEORY = "theory"


class GeneratePlanRequest(BaseModel):
    subject: str
    examDate: str
    topics: List[str]
    pdfText: Optional[str] = None

    @field_validator("subject")
    @classmethod
    def subject_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("subject must not be empty")
        return v

    @field_validator("topics")
    @classmethod
    def topics_not_empty(cls, v: List[str]) -> List[str]:
        cleaned = [t.strip() for t in v if t.strip()]
        if not cleaned:
            raise ValueError("topics list must contain at least one non-empty topic")
        return cleaned


class Question(BaseModel):
    question: str
    type: QuestionType
    difficulty: Difficulty
    probability: float
    priority: Priority
    topic: str
    solution: str

    @field_validator("probability")
    @classmethod
    def clamp_probability(cls, v: float) -> float:
        return round(max(0.0, min(1.0, v)), 3)

    @field_validator("question", "solution", "topic")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()


class TopicInsight(BaseModel):
    predicted_type: str
    confidence: Dict[str, float]


class GeneratePlanResponse(BaseModel):
    mode: ExamMode
    focusTopics: Optional[List[str]] = None
    strategy: str
    questions: List[Question]
    topicInsights: Optional[Dict[str, TopicInsight]] = None
