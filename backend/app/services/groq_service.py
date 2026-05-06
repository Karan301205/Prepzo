import os
import json
from groq import Groq
from dotenv import load_dotenv
from app.services.deadline_service import compute_priority_score, assign_priority

load_dotenv()

# Initialize Groq client
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key and api_key != "your_groq_api_key_here" else None

def build_prompt(subject: str, topics: list, mode: str, pdf_text: str = None) -> str:
    return f"""
    You are an AI Exam Preparation Engine.
    Subject: {subject}
    Topics: {', '.join(topics)}
    Mode: {mode} (Survival=<=3 days, Balanced=4-7 days, Full=>7 days)
    Context: {pdf_text[:1000] if pdf_text else 'None'}
    
    Generate 2 high-probability exam questions based on the above.
    Return ONLY a JSON object with a key 'questions' which is an array of objects. 
    Each object must have: 
    - question (string)
    - type (string: "MCQ", "coding", or "theory")
    - difficulty (string: "easy", "medium", or "hard")
    - probability (float: 0.0 to 1.0)
    - topic (string)
    - solution (string)
    """

def generate_questions(subject: str, topics: list, mode: str, pdf_text: str = None) -> list:
    if not client:
        return [{"question": "Dummy Question", "type": "theory", "difficulty": "medium", "probability": 0.85, "topic": topics[0] if topics else "", "solution": "Dummy"}]

    prompt = build_prompt(subject, topics, mode, pdf_text)
    try:
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You output strict JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content).get("questions", [])
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return []

def parse_questions_from_response(raw_questions: list, weights: dict) -> list:
    parsed = []
    for q in raw_questions:
        topic = q.get("topic", "")
        weight = weights.get(topic, 0.5)
        prob = float(q.get("probability", 0.5))
        score = compute_priority_score(weight, prob)
        priority = assign_priority(score)
        
        q["priority"] = priority
        diff = q.get("difficulty", "medium").lower()
        q["difficulty"] = diff if diff in ["easy", "medium", "hard"] else "medium"
        parsed.append(q)
        
    # Sort: Must -> Should -> Optional, then by probability
    priority_order = {"must": 0, "should": 1, "optional": 2}
    parsed.sort(key=lambda x: (priority_order.get(x["priority"], 3), -x["probability"]))
    return parsed

def chat_with_groq(messages: list) -> str:
    """Base function for chatbot endpoint."""
    if not client:
        return "Dummy Chat Response because API key is missing."
    try:
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=messages,
            temperature=0.7
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Chat Error: {e}"
