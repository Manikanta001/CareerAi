from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.middleware.auth import get_current_user
from app.config import settings
from app.utils.helpers import success_response

router = APIRouter(prefix="/assistant", tags=["AI Assistant"])

class ChatRequest(BaseModel):
    message: str

def generate_fallback_chat_reply(message: str, user_name: str) -> str:
    msg_lower = message.lower()
    if "resume" in msg_lower:
        return f"Hi {user_name}! To optimize your resume score, ensure you quantify your project achievements (e.g., 'Reduced latency by 35% using FastAPI cache'). Include technical keywords like Python, SQL, and Docker."
    elif "dsa" in msg_lower or "coding" in msg_lower:
        return "For placement coding rounds, master Arrays, Two Pointers, Sliding Window, Hash Maps, and Binary Search first. Practice 2-3 medium LeetCode/GeeksforGeeks problems daily."
    elif "mock test" in msg_lower or "test" in msg_lower:
        return "I recommend taking our weekly Mock Tests. Analyze your speed per question and review incorrect responses immediately after finishing."
    elif "career" in msg_lower or "job" in msg_lower:
        return "Based on current market demand, Full Stack and Python/FastAPI Backend Developer roles have high growth. Check out our Skill Gap tab to see what skills you need next."
    else:
        return f"Hello {user_name}! I am your CareerAI placement mentor. Ask me anything about placement preparation, resume score improvement, technical interview topics, or skill gaps!"

@router.post("/chat")
def chat_with_assistant(req: ChatRequest, current_user: dict = Depends(get_current_user)):
    user_name = current_user.get("name", "Student")
    
    # Check if OpenAI API key configured
    if settings.OPENAI_API_KEY:
        try:
            import httpx
            # Simple OpenAI API call if key configured
            headers = {"Authorization": f"Bearer {settings.OPENAI_API_KEY}"}
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": f"You are CareerAI Assistant guiding {user_name} in placement prep."},
                    {"role": "user", "content": req.message}
                ]
            }
            resp = httpx.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=10)
            if resp.status_code == 200:
                reply = resp.json()["choices"][0]["message"]["content"]
                return success_response({"reply": reply}, "AI response generated")
        except Exception as e:
            pass

    reply = generate_fallback_chat_reply(req.message, user_name)
    return success_response({"reply": reply}, "Assistant response generated (Rule-based engine)")
