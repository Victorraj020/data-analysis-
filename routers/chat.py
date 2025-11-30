from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm_report import chat_with_data

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    context: dict  # Pass data summary or relevant context

@router.post("/")
async def chat_endpoint(request: ChatRequest):
    try:
        response = chat_with_data(request.message, request.context)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
