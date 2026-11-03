from typing import Any, Dict, Optional

def success_response(data: Any = None, message: str = "Operation successful") -> Dict[str, Any]:
    return {
        "success": True,
        "message": message,
        "data": data if data is not None else {}
    }

def error_response(message: str = "Something went wrong", error: Optional[str] = None) -> Dict[str, Any]:
    return {
        "success": False,
        "message": message,
        "error": error or message
    }

def parse_json_objectable(doc: dict) -> dict:
    """Convert MongoDB _id to string id for JSON serialization."""
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc
