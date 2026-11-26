"""Create the configured local administrator when the API starts."""
import logging
import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from app.config import ENV_PATH, settings
from app.database.mongodb import get_database
from app.utils.security import hash_password, verify_password

logger = logging.getLogger(__name__)


def ensure_admin_account() -> None:
    load_dotenv(ENV_PATH)
    email = os.getenv("SEED_ADMIN_EMAIL", "admin@gmail.com").strip().lower()
    password = os.getenv("SEED_ADMIN_PASSWORD")
    if not email or not password:
        logger.warning("Admin bootstrap skipped because SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD is not configured")
        return

    users = get_database().users
    existing = users.find_one({"email": email})
    updates = {"name": "CareerAI Administrator", "email": email, "role": "ADMIN"}
    if not existing or not verify_password(password, existing.get("password", "")):
        updates["password"] = hash_password(password)

    users.update_one(
        {"email": email},
        {"$set": updates, "$setOnInsert": {"created_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    logger.info("Configured administrator account is ready")
