import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.main import app

client = TestClient(app)

def test_list_mock_tests():
    res = client.get("/api/tests")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["data"]) > 0
