from __future__ import annotations

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx

router = APIRouter(prefix="/ai", tags=["ai"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatPayload(BaseModel):
    messages: List[ChatMessage]
    provider: str
    model: str
    endpoint: Optional[str] = None

@router.post("/chat")
async def chat_proxy(
    payload: ChatPayload,
    authorization: str | None = Header(None)
) -> dict:
    api_key = authorization.replace("Bearer ", "") if authorization else None
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        # 1. Ollama (Local)
        if payload.provider == "ollama":
            url = f"{payload.endpoint or 'http://localhost:11434'}/api/chat"
            body = {
                "model": payload.model,
                "messages": [m.model_dump() for m in payload.messages],
                "stream": False
            }
            try:
                response = await client.post(url, json=body)
                response.raise_for_status()
                res_data = response.json()
                return {"content": res_data["message"]["content"]}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Ollama error: {str(e)}")

        # 2. OpenAI (BYOK)
        elif payload.provider == "openai":
            if not api_key:
                raise HTTPException(status_code=400, detail="OpenAI API key required")
            url = "https://api.openai.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {api_key}"}
            body = {
                "model": payload.model,
                "messages": [m.model_dump() for m in payload.messages]
            }
            try:
                response = await client.post(url, headers=headers, json=body)
                response.raise_for_status()
                res_data = response.json()
                return {"content": res_data["choices"][0]["message"]["content"]}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

        # 3. Google Gemini (BYOK)
        elif payload.provider == "gemini":
            if not api_key:
                raise HTTPException(status_code=400, detail="Gemini API key required")
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{payload.model}:generateContent?key={api_key}"
            contents = []
            for msg in payload.messages:
                role = "model" if msg.role == "assistant" else "user"
                contents.append({
                    "role": role,
                    "parts": [{"text": msg.content}]
                })
            try:
                response = await client.post(url, json={"contents": contents})
                response.raise_for_status()
                res_data = response.json()
                text = res_data["candidates"][0]["content"]["parts"][0]["text"]
                return {"content": text}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Gemini error: {str(e)}")

        else:
            raise HTTPException(status_code=400, detail="Unsupported AI provider")
