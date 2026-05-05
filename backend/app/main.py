from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app import routes

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Swift Solutions Telehealth API",
    description="Backend API for Swift Solutions Medical Center telehealth platform",
    version="1.0.0"
)

# CORS middleware - allows frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://app.swiftsolutions.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(routes.router)

@app.get("/")
def root():
    return {"message": "Swift Solutions Telehealth API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}