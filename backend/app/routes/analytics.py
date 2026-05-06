from fastapi import APIRouter
from app.utils.store import analytics_data, record_event

router = APIRouter()

@router.get("/analytics")
async def get_analytics():
    """
    Returns platform analytics.
    """
    return analytics_data

@router.post("/analytics/track")
async def track_event(event_type: str):
    """
    Tracks an event (e.g., plan_generated, chat_msg_sent).
    """
    record_event(event_type)
    return {"status": "success", "event": event_type}
