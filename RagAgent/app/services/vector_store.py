from langchain_chroma import Chroma
from langchain_classic.retrievers.self_query import chroma

from app.services.embedding_service import EmbeddingService
from app.core.config import settings

class VectorStoreService:

    @staticmethod
    def get_vector_store():

        embedding_model = EmbeddingService.get_embedding_model()

        vector_store = Chroma(
            collection_name=settings.COLLECTION_NAME,
            embedding_function=embedding_model,
            persist_directory=settings.CHROMA_DB_DIR
        )

        return vector_store

    @staticmethod
    def add_documents(chunks):
        vector_store = VectorStoreService.get_vector_store()

        vector_store.add_documents(chunks)

        return vector_store

    @staticmethod
    def similarity_search(query: str, k: int = 3, filter_metadata:dict = None):
        vector_store = VectorStoreService.get_vector_store()

        results = vector_store.similarity_search(
            query=query,
            k=k,
            filter=filter_metadata
        )

        return results

    @staticmethod
    def delete_collection():
        client = chromadb.PersistentClient(
            path=settings.CHROMA_DB_DIR
        )

        client.delete_collection(
            name=settings.COLLECTION_NAME
        )

        return True