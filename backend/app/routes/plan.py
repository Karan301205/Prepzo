from fastapi import APIRouter
from app.models.schemas import GeneratePlanRequest, GeneratePlanResponse, Question
from app.services.deadline_service import calculate_deadline_mode, assign_topic_weights, build_strategy
from app.services.groq_service import generate_questions, parse_questions_from_response
from app.services.ml_service import compute_topic_weights_tfidf, merge_weights
from app.utils.store import record_plan, record_event

router = APIRouter()

@router.post("/generate-plan", response_model=GeneratePlanResponse)
async def generate_plan(request: GeneratePlanRequest):
    # Calculate mode based on exam deadline
    mode = calculate_deadline_mode(request.examDate)
    
    # Assign rule-based weights using Pareto logic
    rule_weights = assign_topic_weights(request.topics, mode)
    
    # If PDF text is available, compute ML-based weights using TF-IDF
    if request.pdfText:
        ml_weights = compute_topic_weights_tfidf(request.topics, request.pdfText)
        weights = merge_weights(rule_weights, ml_weights, ml_ratio=0.5)
    else:
        weights = rule_weights
    
    # Generate questions from Groq LLM
    raw_questions = generate_questions(
        subject=request.subject,
        topics=request.topics,
        mode=mode,
        pdf_text=request.pdfText
    )
    
    # Parse questions and calculate priority using ML-enhanced weights
    parsed_questions = parse_questions_from_response(raw_questions, weights)
    
    # Convert to Pydantic models
    questions = []
    for q in parsed_questions:
        try:
            questions.append(Question(**q))
        except Exception as e:
            print(f"Error parsing question: {e}")
            pass
            
    # Record analytics
    record_plan(request.subject, mode)
    record_event("plan_generated")
    
    # Return response
    return GeneratePlanResponse(
        mode=mode,
        focusTopics=[t for t, w in weights.items() if w >= 0.4],
        strategy=build_strategy(mode),
        questions=questions
    )
