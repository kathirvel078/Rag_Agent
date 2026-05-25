from app.services.vector_store import VectorStoreService

class RetrieverService:

    @staticmethod
    def retrieve_documents(
        query: str,
        k: int = 3,
        filter_metadata:dict = None
    ):

        results = VectorStoreService.similarity_search(
            query=query,
            k=k,
            filter_metadata=filter_metadata
        )

        return results