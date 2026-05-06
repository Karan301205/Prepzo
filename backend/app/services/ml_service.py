"""
ML Service — TF-IDF based Topic Importance Scoring

Uses scikit-learn's TfidfVectorizer to analyze past question papers
or syllabus text and compute data-driven topic weights.

This replaces hardcoded topic ordering with actual frequency analysis.
"""

from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np


def compute_topic_weights_tfidf(topics: list, pdf_text: str) -> dict:
    """
    Uses TF-IDF to score how important each topic is based on 
    how frequently it appears in the uploaded PDF text.

    Args:
        topics: List of topic strings (e.g., ["Observer Pattern", "SOLID"])
        pdf_text: Raw text extracted from syllabus/past papers

    Returns:
        dict: {topic: weight} where weight is 0.0–1.0 (normalized)
    """
    if not topics or not pdf_text:
        return {}

    # Build a corpus: each topic is a "document", and the PDF is the reference
    corpus = [pdf_text] + topics

    try:
        vectorizer = TfidfVectorizer(
            stop_words="english",
            lowercase=True,
            max_features=500
        )
        tfidf_matrix = vectorizer.fit_transform(corpus)

        # The first row is the PDF text vector
        pdf_vector = tfidf_matrix[0]

        # Compute cosine similarity of each topic against the PDF
        from sklearn.metrics.pairwise import cosine_similarity

        scores = {}
        for i, topic in enumerate(topics):
            topic_vector = tfidf_matrix[i + 1]  # +1 because PDF is index 0
            similarity = cosine_similarity(pdf_vector, topic_vector)[0][0]
            scores[topic] = float(similarity)

        # Normalize scores to 0.0–1.0 range
        if scores:
            max_score = max(scores.values()) if max(scores.values()) > 0 else 1.0
            scores = {k: round(v / max_score, 3) for k, v in scores.items()}

        return scores

    except Exception as e:
        print(f"ML Service Error: {e}")
        return {}


def merge_weights(rule_weights: dict, ml_weights: dict, ml_ratio: float = 0.5) -> dict:
    """
    Merges rule-based Pareto weights with ML-derived TF-IDF weights.

    Args:
        rule_weights: From deadline_service.assign_topic_weights()
        ml_weights: From compute_topic_weights_tfidf()
        ml_ratio: How much to trust the ML model (0.0–1.0)
                  0.0 = fully rule-based, 1.0 = fully ML

    Returns:
        dict: {topic: blended_weight}
    """
    merged = {}
    rule_ratio = 1.0 - ml_ratio

    all_topics = set(list(rule_weights.keys()) + list(ml_weights.keys()))

    for topic in all_topics:
        rule_w = rule_weights.get(topic, 0.5)
        ml_w = ml_weights.get(topic, 0.5)
        merged[topic] = round((rule_w * rule_ratio) + (ml_w * ml_ratio), 3)

    return merged
