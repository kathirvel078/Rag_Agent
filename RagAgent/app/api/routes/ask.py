from fastapi import APIRouter
from app.models.schemas import AskRequest, AskResponse
from app.services.rag_pipeline import RAGPipelineService

router = APIRouter()

@router.post("/", response_model=AskResponse)
async def ask_question(request: AskRequest):

    result = RAGPipelineService.generate_answer(
        question=request.question
    )

    return AskResponse(
        question=request.question,
        answer=result["answer"],
        sources=result["sources"]
    )