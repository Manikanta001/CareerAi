import logging
from pymongo import MongoClient
from pymongo.database import Database
from app.config import settings

logger = logging.getLogger(__name__)

class DatabaseManager:
    client: MongoClient = None
    db: Database = None

db_manager = DatabaseManager()

def connect_to_mongo():
    try:
        db_manager.client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
        db_manager.db = db_manager.client[settings.DATABASE_NAME]
        # Ping to check connection
        db_manager.client.admin.command('ping')
        logger.info(f"Connected to MongoDB database: {settings.DATABASE_NAME}")
    except Exception as exc:
        logger.warning("Failed to connect to MongoDB. Check the connection settings and database availability.")
        db_manager.client = None
        db_manager.db = None
        raise RuntimeError("MongoDB connection is required to start CareerAI") from exc

def get_database() -> Database:
    if db_manager.db is None:
        connect_to_mongo()
    return db_manager.db

def close_mongo_connection():
    if db_manager.client:
        db_manager.client.close()
        logger.info("Closed MongoDB connection.")
