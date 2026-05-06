from sqlalchemy import Column, Integer, String, DateTime, Date, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, default="patient")  # patient or staff
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)
    appointments = relationship("Appointment", foreign_keys="Appointment.patient_id", back_populates="patient")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")

class PatientProfile(Base):
    __tablename__ = "patient_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    date_of_birth = Column(Date, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    zip_code = Column(String, nullable=True)
    insurance_provider = Column(String, nullable=True)
    insurance_id = Column(String, nullable=True)
    emergency_contact_name = Column(String, nullable=True)
    emergency_contact_phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="patient_profile")
    documents = relationship("Document", back_populates="patient")

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    provider_id = Column(Integer, ForeignKey("users.id"))
    appointment_date = Column(DateTime, nullable=False)
    appointment_type = Column(String, default="in-person")  # in-person, video, phone
    status = Column(String, default="scheduled")  # scheduled, completed, cancelled
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    patient = relationship("User", foreign_keys=[patient_id], back_populates="appointments")
    provider = relationship("User", foreign_keys=[provider_id])

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    subject = Column(String, nullable=True)
    body = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id])

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id"))
    file_name = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    s3_key = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    patient = relationship("PatientProfile", back_populates="documents")