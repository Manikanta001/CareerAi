"""Create or promote the configured administrator account without reseeding app content."""
import os
import sys
from datetime import datetime, timezone

from pymongo import MongoClient
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import ENV_PATH, settings
from app.utils.security import hash_password

load_dotenv(ENV_PATH)

#  hello

def seed_admin() -> None:
    email = os.getenv("SEED_ADMIN_EMAIL", "admin@gmail.com").strip().lower()
    password = os.getenv("SEED_ADMIN_PASSWORD")
    if not email or not password:
        raise RuntimeError("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before creating the admin account")

    client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
    try:
        db = client[settings.DATABASE_NAME]
        db.command("ping")
        db.users.update_one(
            {"email": email},
            {
                "$set": {
                    "name": "CareerAI Administrator",
                    "email": email,
                    "password": hash_password(password),
                    "role": "ADMIN",
                },
                "$setOnInsert": {"created_at": datetime.now(timezone.utc)},
            },
            upsert=True,
        )
        print(f"Admin account ready for {email}")
    finally:
        client.close()


if __name__ == "__main__":
    seed_admin()
