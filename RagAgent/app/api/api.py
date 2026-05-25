from fastapi import APIRouter
from app.api.routes.upload import router as upload_router
from app.api.routes.ask import router as ask_router

api_router = APIRouter()

api_router.include_router(upload_router, prefix="/upload", tags=["Upload"])
api_router.include_router(ask_router, prefix="/ask", tags=["Ask"])