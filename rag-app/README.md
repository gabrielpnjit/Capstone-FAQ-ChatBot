# Langchain RAG-Pinecone Setup
\*Requires Python Version 3.11+
## 1. pip install:
- `$ pip install --upgrade langchain langchain-cli langchain-pinecone langchain-openai langchain-cohere`
- Navigate to "rag-app" directory and execute `$ pip install .`
## 2. Set Environment Variables
The following commands are used in a Linux/Unix Shell:
- `$ export OPENAI_API_KEY=[KEY HERE]`
	- [OpenAI API Key](https://platform.openai.com/api-keys)
- `$ export PINECONE_API_KEY=[KEY HERE]`
	- [Pinecone API Key](https://docs.pinecone.io/guides/getting-started/authentication)
- `$ export PINECONE_ENVIRONMENT=[PINECONE ENVIRONMENT HERE]`
	- Your Pinecone environment, found in the [Pinecone console](https://app.pinecone.io/), e.g. us-west1-gcp, us-east-1-aws, etc.
- `$ export PINECONE_INDEX=[PINECONE INDEX NAME HERE]`
	- [Indexes Tab](https://app.pinecone.io/)
- `$ COHERE_API_KEY=[COHERE API KEY HERE]`
	- [Cohere API Key](https://dashboard.cohere.com/api-keys)
If using Microsoft PowerShell:
```powershell
$Env:OPENAI_API_KEY = '[KEY HERE]'
$Env:PINECONE_API_KEY = '[KEY HERE]'
$Env:PINECONE_ENVIRONMENT = '[PINECONE ENVIRONMENT HERE]'
$Env:PINECONE_INDEX = '[PINECONE INDEX NAME HERE]'
$Env:COHERE_API_KEY = '[COHERE API KEY HERE]'
```
## 3. Pinecone Documents:
- Go to rag-app\\packages\\rag-pinecone\\rag_pinecone\\chain.py
```python
from langchain_community.document_loaders.csv_loader import CSVLoader
# from langchain_community.document_loaders import Docx2txtLoader
# from langchain_community.document_loaders import UnstructuredPowerPointLoader
# from langchain_community.document_loaders import PyPDFLoader
# from langchain_community.document_loaders import TextLoader

loader = CSVLoader("packages/rag-pinecone/documents/capstone-schedule.csv")
docs = loader.load()
```
- Adjust these lines to load the documents into the pinecone database that you want to use. Make sure to use the appropriate document loader. 
- Don't run this code for the same document multiple times because it will create duplicate entries into the pinecone database, as well as use up OpenAI tokens because of the embedding.
## 4. Start Langserve
- In rag-app directory: `$ langchain serve`
- Playground: http://localhost:8000/rag-pinecone/playground/
