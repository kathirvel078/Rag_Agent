from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import UploadResponse
from app.services.retriever import RetrieverService
from app.utils.helpers import validate_file_type
from app.core.config import settings
from app.services.document_loader import DocumentLoaderService
from app.services.text_splitter import TextSplitterService
from app.services.embedding_service import EmbeddingService
from app.services.vector_store import VectorStoreService

import os

router = APIRouter()

# Upload Document
@router.post("/", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):

    # Validate file type
    if not validate_file_type(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX, and TXT files are allowed"
        )

    # Create uploads folder if not exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # File path
    file_path = os.path.join(
        settings.UPLOAD_DIR,
        file.filename
    )

    # Read file content safely
    content = await file.read()

    # Save file
    with open(file_path, "wb") as buffer:
        buffer.write(content)

    return UploadResponse(
        filename=file.filename,
        filepath=file_path,
        message="File uploaded successfully"
    )

# Generate Chunks
@router.get("/chunks/{filename}")
async def generate_chunks(filename: str):

    file_path = os.path.join(
        settings.UPLOAD_DIR,
        filename
    )

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    # Load document
    documents = DocumentLoaderService.load_document(
        file_path
    )

    # Split into chunks
    chunks = TextSplitterService.split_documents(
        documents
    )

    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="No text extracted from document"
        )

    return {
        "filename": filename,
        "total_chunks": len(chunks),
        "first_chunk_preview": chunks[0].page_content[:500],
        "first_chunk_metadata": chunks[0].metadata
    }

# Generate Embeddings
@router.get("/embeddings/{filename}")
async def generate_embeddings(filename: str):

    file_path = os.path.join(
        settings.UPLOAD_DIR,
        filename
    )

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    # Load documents
    documents = DocumentLoaderService.load_document(
        file_path
    )

    # Split documents
    chunks = TextSplitterService.split_documents(
        documents
    )

    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="No text extracted from document"
        )

    # Load embedding model
    embedding_model = (
        EmbeddingService.get_embedding_model()
    )

    # Generate embedding
    embedding_vector = embedding_model.embed_query(
        chunks[0].page_content
    )  #dimensions

    return {
        "filename": filename,
        "total_chunks": len(chunks),
        "embedding_dimension": len(embedding_vector),
        "sample_embedding_values": embedding_vector[:10]
    }

# Store in ChromaDB
@router.post("/store/{filename}")
async def store_document_embeddings(filename: str):

    file_path = os.path.join(
        settings.UPLOAD_DIR,
        filename
    )

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    # Load document
    documents = DocumentLoaderService.load_document(
        file_path
    )

    # Split into chunks
    chunks = TextSplitterService.split_documents(
        documents
    )

    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="No text extracted from document"
        )

    # Store in vector DB
    VectorStoreService.add_documents(chunks)

    return {
        "message": "Documents stored successfully",
        "filename": filename,
        "total_chunks_stored": len(chunks)
    }

# Similarity Search
@router.get("/search")
async def search_documents(
    query: str,
    k: int = 3
):

    results = VectorStoreService.similarity_search(
        query=query,
        k=k
    )

    formatted_results = []

    for doc in results:

        formatted_results.append({
            "content": doc.page_content[:300],
            "metadata": doc.metadata
        })

    return {
        "query": query,
        "total_results": len(formatted_results),
        "results": formatted_results
    }

# Retriever Search
@router.get("/retrieve")
async def retrieve_chunks(
    query: str,
    k: int = 3
):

    results = RetrieverService.retrieve_documents(
        query=query,
        k=k
    )

    formatted_results = []

    for index, doc in enumerate(results):

        formatted_results.append({
            "rank": index + 1,
            "content": doc.page_content[:500],
            "metadata": doc.metadata
        })

    return {
        "query": query,
        "total_results": len(formatted_results),
        "results": formatted_results
    }

# Delete Chroma Collection
# ==============================
@router.delete("/delete-collection")
async def delete_collection():

    VectorStoreService.delete_collection()

    return {
        "message": "Collection deleted successfully"
    }