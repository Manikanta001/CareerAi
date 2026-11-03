import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.main import app

client = TestClient(app)

def test_get_questions():
    res = client.get("/api/questions")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_get_careers():
    res = client.get("/api/careers")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
