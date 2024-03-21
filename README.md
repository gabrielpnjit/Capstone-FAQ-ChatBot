Langchain RAG-Pinecone Setup
## pip install:
- `$ pip install --upgrade langchain langchain-cli langchain-pinecone langchain-openai`
## Set Environment Variables
- The following commands are used in a Linux/Unix Shell
- Replace `[KEY HERE]` with your actual API keys.
- `$ export OPENAI_API_KEY=[KEY HERE]`
	- [OpenAI API Key](https://platform.openai.com/api-keys)
- `$ export PINECONE_API_KEY=[KEY HERE]`
	- [Pinecone API Key](https://docs.pinecone.io/guides/getting-started/authentication)
## Pinecone documents:
- Go to packages\\rag-pinecone\\rag_pinecone\\chain.py
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
## Start Langserve
- in root directory: `$ langchain serve`
- Playground: http://localhost:8000/rag-pinecone/playground/