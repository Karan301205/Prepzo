# In-memory store for MVP analytics

analytics_data = {
    "totalPlansGenerated": 0,
    "topSubjects": {},
    "modeBreakdown": {"survival": 0, "balanced": 0, "full": 0},
    "users_count": 0,
    "avg_q_per_user": 0,
    "chat_msgs": 0
}

def record_plan(subject: str, mode: str):
    """
    Tracks an event when a plan is generated.
    """
    analytics_data["totalPlansGenerated"] += 1
    
    # Track subjects
    if subject in analytics_data["topSubjects"]:
        analytics_data["topSubjects"][subject] += 1
    else:
        analytics_data["topSubjects"][subject] = 1
        
    # Track modes
    if mode in analytics_data["modeBreakdown"]:
        analytics_data["modeBreakdown"][mode] += 1
        
def record_event(event_type: str):
    """
    Tracks generic events.
    """
    if event_type == "plan_generated":
        analytics_data["totalPlansGenerated"] += 1
    elif event_type == "chat_msg_sent":
        analytics_data["chat_msgs"] += 1
    elif event_type == "user_registered":
        analytics_data["users_count"] += 1
