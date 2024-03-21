import os

from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_pinecone import PineconeVectorStore

if os.environ.get("PINECONE_API_KEY", None) is None:
    raise Exception("Missing `PINECONE_API_KEY` environment variable.")

## I don't think PINECONE_ENVIRONMENT variable is necessary
# if os.environ.get("PINECONE_ENVIRONMENT", None) is None:
#     raise Exception("Missing `PINECONE_ENVIRONMENT` environment variable.")

PINECONE_INDEX_NAME = os.environ.get("PINECONE_INDEX", "test") # change "test" to whatever is the name of the pincecone index you created

## Code to populate pinecone database. only run this for each document. Running multiple times will insert duplicate vectors
# Load
from langchain_community.document_loaders.csv_loader import CSVLoader
# from langchain_community.document_loaders import Docx2txtLoader
# from langchain_community.document_loaders import UnstructuredPowerPointLoader
# from langchain_community.document_loaders import PyPDFLoader
# from langchain_community.document_loaders import TextLoader

loader = CSVLoader("packages/rag-pinecone/documents/capstone-schedule.csv")
docs = loader.load()
# pages = loader.load_and_split()

# Split
from langchain_text_splitters import RecursiveCharacterTextSplitter
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
all_splits = text_splitter.split_documents(docs)

# Add to vectorDB
vectorstore = PineconeVectorStore.from_documents(
    documents=all_splits, embedding=OpenAIEmbeddings(), index_name=PINECONE_INDEX_NAME
)
retriever = vectorstore.as_retriever()

vectorstore = PineconeVectorStore.from_existing_index(
    PINECONE_INDEX_NAME, OpenAIEmbeddings()
)
retriever = vectorstore.as_retriever()

# RAG prompt
template = """You are an FAQ Discord Bot for New Jersey Institute of Technology's CS491 Capstone Course. Only answer questions if you are confident, and provide answers in a more general context.
Answer the question based only on the following context:
{context}
Question: {question}
"""
prompt = ChatPromptTemplate.from_template(template)

# RAG
model = ChatOpenAI()
chain = (
    RunnableParallel({"context": retriever, "question": RunnablePassthrough()})
    | prompt
    | model
    | StrOutputParser()
)


# Add typing for input
class Question(BaseModel):
    __root__: str


chain = chain.with_types(input_type=Question)
