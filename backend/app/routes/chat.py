from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.services.groq_service import chat_with_groq
from app.utils.store import record_event

router = APIRouter()


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    subject: Optional[str] = None
    examDate: Optional[str] = None
    mode: Optional[str] = None
    topics: Optional[List[str]] = None
    # Frontend can pass the generated questions for context-aware explanations
    questionsContext: Optional[List[Dict[str, Any]]] = None


@router.post("/chat")
async def chat_with_bot(request: ChatRequest):
    """
    Context-aware chatbot endpoint.

    Accepts optional mode, topics, and questionsContext so the AI can
    explain specific generated questions and give mode-appropriate coaching.
    """
    msgs = [{"role": m.role, "content": m.content} for m in request.messages]

    reply = chat_with_groq(
        messages=msgs,
        subject=request.subject,
        mode=request.mode,
        topics=request.topics,
        questions_context=request.questionsContext,
        exam_date=request.examDate,
    )

    record_event("chat_msg_sent")

    return {"reply": reply}
