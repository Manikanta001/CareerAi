import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database.mongodb import connect_to_mongo, close_mongo_connection
from app.database.indexes import create_db_indexes
from app.services.admin_bootstrap import ensure_admin_account
from app.middleware.error_handler import custom_exception_handler

# Import Routers
from app.routes import (
    auth, profile, resume, careers, skills, jobs,
    subjects, topics, lessons, questions, tests,
    performance, recommendations, coding, interview,
    assistant, admin, company_prep
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("careerai")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing CareerAI Backend Application...")
    connect_to_mongo()
    create_db_indexes()
    ensure_admin_account()
    yield
    logger.info("Shutting down CareerAI Backend Application...")
    close_mongo_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="CareerAI — AI-Powered Career Intelligence & Placement Preparation Platform Backend API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.FRONTEND_URL.split(",") if origin.strip()],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handler
app.add_exception_handler(Exception, custom_exception_handler)

# Register API Routers under /api
api_prefix = "/api"
app.include_router(auth.router, prefix=api_prefix)
app.include_router(profile.router, prefix=api_prefix)
app.include_router(resume.router, prefix=api_prefix)
app.include_router(careers.router, prefix=api_prefix)
app.include_router(skills.router, prefix=api_prefix)
app.include_router(jobs.router, prefix=api_prefix)
app.include_router(subjects.router, prefix=api_prefix)
app.include_router(topics.router, prefix=api_prefix)
app.include_router(lessons.router, prefix=api_prefix)
app.include_router(questions.router, prefix=api_prefix)
app.include_router(tests.router, prefix=api_prefix)
app.include_router(performance.router, prefix=api_prefix)
app.include_router(recommendations.router, prefix=api_prefix)
app.include_router(coding.router, prefix=api_prefix)
app.include_router(interview.router, prefix=api_prefix)
app.include_router(company_prep.router, prefix=api_prefix)
app.include_router(assistant.router, prefix=api_prefix)
app.include_router(admin.router, prefix=api_prefix)
app.include_router(admin.updates_router, prefix=api_prefix)

@app.get("/")
def root():
    return {
        "success": True,
        "message": "Welcome to CareerAI Backend API Server",
        "docs_url": "/docs",
        "status": "Healthy"
    }

@app.get("/healthz", include_in_schema=False)
def healthz():
    from app.database.mongodb import get_database
    try:
        get_database().command("ping")
    except Exception:
        return JSONResponse(status_code=503, content={"status": "unavailable"})
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
