from datetime import datetime

def calculate_deadline_mode(exam_date_str: str) -> str:
    """
    Calculates the deadline mode based on the exam date.
    <= 3 days -> survival
    4-7 days -> balanced
    > 7 days -> full
    """
    try:
        exam_date = datetime.strptime(exam_date_str, "%Y-%m-%d")
        today = datetime.now()
        days_left = (exam_date - today).days
        
        if days_left <= 3:
            return "survival"
        elif 4 <= days_left <= 7:
            return "balanced"
        else:
            return "full"
    except ValueError:
        return "balanced"

def assign_topic_weights(topics: list, mode: str) -> dict:
    """Assigns weights to topics based on Pareto filtering."""
    weights = {}
    total = len(topics)
    if not total:
        return weights
        
    for i, topic in enumerate(topics):
        rank = (i + 1) / total
        if mode == "survival":
            weights[topic] = 1.0 if rank <= 0.3 else 0.1
        elif mode == "balanced":
            weights[topic] = 1.0 if rank <= 0.6 else 0.4
        else:
            weights[topic] = 1.0
    return weights

def compute_priority_score(topic_weight: float, ai_prob: float) -> float:
    """Formula: (weight * 0.6) + (ai_prob * 0.4)"""
    return (topic_weight * 0.6) + (ai_prob * 0.4)

def assign_priority(score: float) -> str:
    """Maps score to Priority enum."""
    if score >= 0.7:
        return "must"
    elif score >= 0.4:
        return "should"
    return "optional"

def build_strategy(mode: str) -> str:
    """Returns human readable strategy based on mode."""
    if mode == "survival":
        return "Survival Mode: Focus only on MUST DO questions. Skip optional topics to maximize chances."
    elif mode == "balanced":
        return "Balanced Mode: Complete MUST DO and SHOULD DO questions. Ensure strong theory foundation."
    return "Full Mode: Cover all questions, take your time to deep dive into core concepts."
