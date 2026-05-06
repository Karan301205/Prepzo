import pdfplumber
import re

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts text from a given PDF file.
    """
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def extract_topics_from_text(text: str) -> list:
    """Heuristic bullet/number list detection for topics."""
    lines = text.split("\n")
    topics = []
    for line in lines:
        line = line.strip()
        if re.match(r'^[\-\*\•]\s+(.*)', line) or re.match(r'^\d+\.\s+(.*)', line):
            topic = re.sub(r'^[\-\*\•\d\.]\s+', '', line)
            if 3 < len(topic) < 50:
                topics.append(topic)
    # Deduplicate while preserving order
    seen = set()
    return [x for x in topics if not (x in seen or seen.add(x))][:10]
