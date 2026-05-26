from langchain_huggingface import HuggingFaceEmbeddings
from app.core.config import settings

class EmbeddingService:

    @staticmethod
    def get_embedding_model():

        embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL  #sentence-transformers/all-MiniLM-L6-v2-->embedding/semantic search
        )

        return embeddings