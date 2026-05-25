import os

from langchain_community.document_loaders import (
    PyPDFLoader,
    Docx2txtLoader,
    TextLoader
)

class DocumentLoaderService:

    @staticmethod
    def load_document(file_path: str):

        extension = os.path.splitext(file_path)[1].lower()

        if extension == ".pdf":
            loader = PyPDFLoader(file_path)

        elif extension == ".docx":
            loader = Docx2txtLoader(file_path)

        elif extension == ".txt":
            loader = TextLoader(file_path, encoding="utf-8")

        else:
            raise ValueError(f"Unsupported file type: {extension}")

        documents = loader.load()

        return documents

