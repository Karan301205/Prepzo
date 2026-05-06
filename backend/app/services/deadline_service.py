import math
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
    """
    Assigns weights to topics based on Pareto filtering.

    Uses index-based counting (not rank-based threshold) so that small topic
    lists always produce at least one high-weight topic. The original rank
    formula `(i+1)/total <= 0.3` was never satisfied for ≤3 topics, causing
    all weights to be 0.1 and every question to show as 'optional'.
    """
    weights = {}
    total = len(topics)
    if not total:
        return weights

    if mode == "survival":
        # Top 30%, minimum 1 topic guaranteed
        top_n = max(1, math.ceil(total * 0.3))
        for i, topic in enumerate(topics):
            weights[topic] = 1.0 if i < top_n else 0.1

    elif mode == "balanced":
        # Top 60%, minimum 1 topic guaranteed
        top_n = max(1, math.ceil(total * 0.6))
        for i, topic in enumerate(topics):
            weights[topic] = 1.0 if i < top_n else 0.4

    else:  # full
        # Apply light Pareto differentiation even in full mode so that priority
        # scoring creates a visible must/should/optional distribution rather than
        # labelling every question "must". Top 50% = 1.0 (core topics), rest = 0.65
        # (important but secondary). Both tiers still get questions — this only
        # affects priority labels, not coverage.
        top_n = max(1, math.ceil(total * 0.5))
        for i, topic in enumerate(topics):
            weights[topic] = 1.0 if i < top_n else 0.65

    return weights


# Mode-specific priority thresholds.
# Survival mode uses a lower bar so that every question the AI selects
# (even from low-weight topics) still shows as "must" or "should", never
# "optional" — a student in crisis mode has no time for optional work.
# Full mode uses a slightly higher bar to create meaningful distribution
# across must/should/optional when broad coverage is the goal.
_PRIORITY_THRESHOLDS = {
    "survival": {"must": 0.62, "should": 0.30},
    "balanced": {"must": 0.70, "should": 0.40},
    # Full mode: with weight=1.0 + prob_floor=0.52, min score is ~0.808.
    # Raise thresholds to create visible must/should/optional distribution:
    #   weight=1.0 + prob≥0.70  → score≥0.88 → "must"
    #   weight=1.0 + prob<0.70  → score<0.88 → "should"
    #   weight=0.65 + any prob  → score<0.88 → "should" or "optional"
    "full":     {"must": 0.88, "should": 0.65},
}


def compute_priority_score(topic_weight: float, ai_prob: float) -> float:
    """Formula: (weight * 0.6) + (ai_prob * 0.4)"""
    return (topic_weight * 0.6) + (ai_prob * 0.4)


def assign_priority(score: float, mode: str = "balanced") -> str:
    """Maps score to Priority enum using mode-specific thresholds."""
    thresholds = _PRIORITY_THRESHOLDS.get(mode, _PRIORITY_THRESHOLDS["balanced"])
    if score >= thresholds["must"]:
        return "must"
    elif score >= thresholds["should"]:
        return "should"
    return "optional"


def build_strategy(mode: str) -> str:
    """Returns actionable strategy text shown to the student."""
    if mode == "survival":
        return (
            "SURVIVAL MODE — Execute triage. Answer every MUST question first: "
            "they cover roughly 80% of exam marks. Skip optional topics entirely. "
            "Your goal is maximum marks in minimum time. "
            "Speed and accuracy on core concepts wins."
        )
    elif mode == "balanced":
        return (
            "BALANCED MODE — Build systematic coverage. Complete all MUST questions "
            "thoroughly, then work through SHOULD questions. Balance conceptual "
            "understanding with exam technique. "
            "One solid revision pass beats three rushed ones."
        )
    return (
        "FULL MODE — Build real mastery. Cover every question, revisit the hard ones "
        "twice, and connect concepts across topics. Use this time for depth: understand "
        "mechanisms, study edge cases, and practise applying theory to realistic scenarios. "
        "Deep understanding now means genuine confidence on exam day."
    )
