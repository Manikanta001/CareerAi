import logging
from pymongo import ASCENDING, TEXT
from app.database.mongodb import get_database

logger = logging.getLogger(__name__)

def create_db_indexes():
    db = get_database()
    if db is None:
        raise RuntimeError("MongoDB is required to initialize database indexes")

    db.users.create_index([("email", ASCENDING)], unique=True)
    db.profiles.create_index([("user_id", ASCENDING)], unique=True)
    db.questions.create_index([("subject", ASCENDING)])
    db.questions.create_index([("topic", ASCENDING)])
    db.questions.create_index([("difficulty", ASCENDING)])
    db.test_attempts.create_index([("user_id", ASCENDING)])
    db.jobs.create_index([("title", TEXT), ("company", TEXT), ("description", TEXT)])
    logger.info("MongoDB indexes verified/created successfully.")
