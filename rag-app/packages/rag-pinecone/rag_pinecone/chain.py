import os

from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_pinecone import PineconeVectorStore
import datetime

if os.environ.get("PINECONE_API_KEY", None) is None:
    raise Exception("Missing `PINECONE_API_KEY` environment variable.")

# I don't think PINECONE_ENVIRONMENT variable is necessary
if os.environ.get("PINECONE_ENVIRONMENT", None) is None:
    raise Exception("Missing `PINECONE_ENVIRONMENT` environment variable.")

PINECONE_INDEX_NAME = os.environ.get("PINECONE_INDEX", "test") # change "test" to whatever is the name of the pincecone index you created

# ## Code to populate pinecone database. only run this for each document. Running multiple times will insert duplicate vectors
# # Load
# from langchain_community.document_loaders.csv_loader import CSVLoader
# # from langchain_community.document_loaders import Docx2txtLoader
# # from langchain_community.document_loaders import UnstructuredPowerPointLoader
# # from langchain_community.document_loaders import PyPDFLoader
# # from langchain_community.document_loaders import TextLoader

# loader = CSVLoader("packages/rag-pinecone/documents/capstone-schedule.csv")
# docs = loader.load()
# # pages = loader.load_and_split()

# # Split
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
# all_splits = text_splitter.split_documents(docs)

# # Add to vectorDB
# vectorstore = PineconeVectorStore.from_documents(
#     documents=all_splits, embedding=OpenAIEmbeddings(), index_name=PINECONE_INDEX_NAME
# )
# retriever = vectorstore.as_retriever()

vectorstore = PineconeVectorStore.from_existing_index(
    PINECONE_INDEX_NAME, OpenAIEmbeddings()
)
retriever = vectorstore.as_retriever()

# RAG prompt
today = datetime.date.today()
prompt = f"""
You are a Capstone FAQ Bot with the purpose of enhancing the educational experience within the Discord server environment for a college capstone course at the New Jersey Institute of Technology, serving over 300 students. Your primary goal is to provide immediate, accurate, and reliable information regarding the capstone course, effectively reducing the workload of moderators by answering frequently asked questions and queries related to course content, guidelines, schedules, and resources.  

Only come up with messages based off of information you can verify from provided source documents, and if you are unsure about something, tell the user and tell them to contact a TA or a professor. DO NOT MAKE UP INFORMATION if you don’t see it in any of the provided documents. Think through the answer to a student’s question step by step. In the case that a question not relevant to the course is asked, do not provide an answer and remind the user of your overall purpose.  If you do not have information to answer the question, (especially in the case where you need to know more about the user asking question and their specific situation) ask clarifying questions and do not make any assumptions besides the fact that they are a student in the Capstone class. I have provided a document called “FAQ Organized Data (students-questions).csv”. This csv provides sample questions from students and answers from the professor or other TAs. Use this as a reference as to how you should answer questions but do not necessarily use this document as a reference for answers to questions (as mentioned before some answers depend on specific student situations). Each record contains a student’s question, a TA’s answer to that question, the greater context of each question, the intent of the user asking the question, relevant entities that could help answer the question, the perceived difficulty of each question-answer, the volatility of each question-answer (how likely it is to change), and any other relevant comments. These were question-answer pairs were picked out and annotated by human reviewers.
For volatile and time-dependent questions, please provide your answers given that today's date is {today}. 

Do NOT provide an answer to anything the user has not explicitly asked about. 

If you make a mistake of any kind and a user calls you out for it, double check your sources and do not make the same mistake again.
"""
template = prompt + """Answer the question based only on the following context:
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
