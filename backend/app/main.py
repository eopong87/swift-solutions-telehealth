from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app import routes
import time
import sqlalchemy

# Wait for database to be ready
def wait_for_db():
    retries = 10
    while retries > 0:
        try:
            Base.metadata.create_all(bind=engine)
            print("Database connected successfully!")
            return
        except sqlalchemy.exc.OperationalError:
            print(f"Database not ready, retrying... ({retries} attempts left)")
            retries -= 1
            time.sleep(3)
    raise Exception("Could not connect to database after multiple attempts")

wait_for_db()

app = FastAPI(
    title="Swift Solutions Telehealth API",
    description="Backend API for Swift Solutions Medical Center telehealth platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://app.swiftsolutions.com", "http://swift-solutions-frontend.s3-website-us-east-1.amazonaws.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

@app.get("/")
def root():
    return {"message": "Swift Solutions Telehealth API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}