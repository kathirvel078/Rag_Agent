from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL")
    CHROMA_DB_DIR = os.getenv("CHROMA_DB_DIR")
    COLLECTION_NAME = os.getenv("COLLECTION_NAME")
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")
    UPLOAD_DIR = os.getenv("UPLOAD_DIR")

settings = Settings()

# Create upload directory automatically
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)