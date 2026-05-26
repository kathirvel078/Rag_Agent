from fastapi import FastAPI
from app.api.api import api_router
from starlette.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI RAG Application",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)

@app.get("/")
def root():
    return {
        "message": "AI RAG Application Running"
    }