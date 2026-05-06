from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
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

@router.post("/chat")
async def chat_with_bot(request: ChatRequest):
    """
    Chatbot endpoint for doubts and explanations.
    """
    sys_prompt = {
        "role": "system", 
        "content": f"You are Prepzo Exam Assistant. Subject: {request.subject or 'Unknown'}. ExamDate: {request.examDate or 'Unknown'}."
    }
    
    msgs = [sys_prompt] + [{"role": m.role, "content": m.content} for m in request.messages]
    reply = chat_with_groq(msgs)
    
    record_event("chat_msg_sent")
    
    return {
        "reply": reply
    }
