from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate

from app.services.retriever import RetrieverService
from app.core.config import settings

class RAGPipelineService:

    @staticmethod
    def get_llm():

        llm = ChatOllama(
            model=settings.OLLAMA_MODEL,
            temperature=0.1
        )

        return llm

    @staticmethod
    def build_context(documents):

        context = "\n\n".join([
            doc.page_content
            for doc in documents
        ])

        return context

    @staticmethod
    def build_prompt():

        template = """
You are an AI assistant for question-answering tasks.

Use ONLY the provided context to answer the question.

If the answer is not available in the context, say:
"I could not find the answer in the provided documents."

Context:
{context}

Question:
{question}

Answer:
"""

        prompt = PromptTemplate(
            template=template,
            input_variables=["context", "question"]
        )

        return prompt

    @staticmethod
    def generate_answer(question: str):

        # Retrieve relevant chunks
        documents = RetrieverService.retrieve_documents(
            query=question,
            k=3
        )

        # Build context
        context = RAGPipelineService.build_context(documents)

        # Build prompt
        prompt = RAGPipelineService.build_prompt()

        # Initialize LLM
        llm = RAGPipelineService.get_llm()

        # Create final chain
        chain = prompt | llm

        # Generate response
        response = chain.invoke({
            "context": context,
            "question": question
        })

        return {
            "answer": response.content,
            "sources": [
                doc.metadata
                for doc in documents
            ]
        }