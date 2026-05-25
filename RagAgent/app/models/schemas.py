from pydantic import BaseModel

class UploadResponse(BaseModel):
    filename: str
    filepath: str
    message: str

class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    question: str
    answer: str
    sources:list