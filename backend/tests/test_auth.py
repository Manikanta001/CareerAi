import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["success"] is True

def test_user_registration_and_login():
    email = f"test_user_{os.urandom(4).hex()}@example.com"
    reg_payload = {
        "name": "Test Student",
        "email": email,
        "password": "Password@123"
    }
    # Register
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "access_token" in data["data"]

    # Login
    login_payload = {
        "email": email,
        "password": "Password@123"
    }
    res_login = client.post("/api/auth/login", json=login_payload)
    assert res_login.status_code == 200
    assert res_login.json()["success"] is True
