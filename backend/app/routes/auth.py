from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class SendOTPRequest(BaseModel):
    phone: str

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str

# Mock in-memory database for OTPs (MVP scope)
otp_store = {}

@router.post("/send-otp")
async def send_otp(request: SendOTPRequest):
    """
    Dummy endpoint to simulate sending an OTP to a phone number.
    """
    # In a real app, integrate with Twilio or similar SMS gateway
    dummy_otp = "123456" # Hardcoded for MVP
    otp_store[request.phone] = dummy_otp
    return {"status": "success", "message": f"OTP sent to {request.phone}"}

@router.post("/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    """
    Dummy endpoint to verify the provided OTP.
    """
    expected_otp = otp_store.get(request.phone)
    if expected_otp and expected_otp == request.otp:
        return {"status": "success", "message": "OTP verified successfully", "token": "dummy_jwt_token_123"}
    return {"status": "error", "message": "Invalid OTP"}
