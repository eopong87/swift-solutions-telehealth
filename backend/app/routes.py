from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models
from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from passlib.context import CryptContext
from typing import Optional

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── Pydantic Schemas ──────────────────────────────────────────

class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    role: str = "patient"

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class PatientProfileCreate(BaseModel):
    date_of_birth: Optional[date] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_id: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

class AppointmentCreate(BaseModel):
    patient_id: int
    provider_id: int
    appointment_date: datetime
    appointment_type: str = "in-person"
    notes: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    provider_id: int
    appointment_date: datetime
    appointment_type: str
    status: str
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    receiver_id: int
    subject: Optional[str] = None
    body: str

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    subject: Optional[str]
    body: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# ── User Routes ───────────────────────────────────────────────

@router.post("/users/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = pwd_context.hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    if user.role == "patient":
        profile = models.PatientProfile(user_id=db_user.id)
        db.add(profile)
        db.commit()
    
    return db_user

@router.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ── Patient Profile Routes ────────────────────────────────────

@router.put("/patients/{user_id}/profile")
def update_patient_profile(user_id: int, profile_data: PatientProfileCreate, db: Session = Depends(get_db)):
    profile = db.query(models.PatientProfile).filter(models.PatientProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    for key, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return {"message": "Profile updated successfully"}

@router.get("/patients/{user_id}/profile")
def get_patient_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.PatientProfile).filter(models.PatientProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

# ── Appointment Routes ────────────────────────────────────────

@router.post("/appointments", response_model=AppointmentResponse)
def create_appointment(appt: AppointmentCreate, db: Session = Depends(get_db)):
    db_appt = models.Appointment(**appt.dict())
    db.add(db_appt)
    db.commit()
    db.refresh(db_appt)
    return db_appt

@router.get("/appointments", response_model=List[AppointmentResponse])
def get_appointments(db: Session = Depends(get_db)):
    return db.query(models.Appointment).all()

@router.get("/appointments/{patient_id}", response_model=List[AppointmentResponse])
def get_patient_appointments(patient_id: int, db: Session = Depends(get_db)):
    return db.query(models.Appointment).filter(models.Appointment.patient_id == patient_id).all()

@router.put("/appointments/{appointment_id}/status")
def update_appointment_status(appointment_id: int, status: str, db: Session = Depends(get_db)):
    appt = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = status
    db.commit()
    return {"message": "Status updated"}

# ── Message Routes ────────────────────────────────────────────

@router.post("/messages", response_model=MessageResponse)
def send_message(message: MessageCreate, sender_id: int, db: Session = Depends(get_db)):
    db_message = models.Message(
        sender_id=sender_id,
        **message.dict()
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/messages/{user_id}", response_model=List[MessageResponse])
def get_messages(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Message).filter(
        (models.Message.receiver_id == user_id) | 
        (models.Message.sender_id == user_id)
    ).all()

@router.put("/messages/{message_id}/read")
def mark_message_read(message_id: int, db: Session = Depends(get_db)):
    message = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    message.is_read = True
    db.commit()
    return {"message": "Marked as read"}

# ── Chat Routes ───────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    user_name: str

@router.post("/chat")
async def chat(request: ChatRequest):
    import anthropic
    import os
    
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system="""You are a helpful medical assistant for Swift Solutions Medical Center. 
        You help patients with general health questions, appointment preparation, 
        understanding medical terms, and health tips. 
        Always remind patients to consult their doctor for specific medical advice.
        Be warm, professional, and concise.""",
        messages=[
            {"role": "user", "content": f"{request.user_name} asks: {request.message}"}
        ]
    )
    
    return {"response": message.content[0].text}
# trigger rebuild
