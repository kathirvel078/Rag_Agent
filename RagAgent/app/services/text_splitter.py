from langchain_text_splitters import RecursiveCharacterTextSplitter

class TextSplitterService:

    @staticmethod
    def split_documents(documents):

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            separators=[
                "\n\n",  #para
                "\n",   #line
                " ",    #word
                ""      #char to large 
            ]
        )

        chunks = text_splitter.split_documents(documents)

        return chunks