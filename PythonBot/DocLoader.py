from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_community.document_loaders import Docx2txtLoader
from langchain_community.document_loaders import UnstructuredPowerPointLoader
from typing import List, Dict
from unstructured.partition.html import partition_html
from unstructured.chunking.title import chunk_by_title
import hnswlib
import cohere
import os
CTOKEN = os.getenv('COHERE_TOKEN')

co = cohere.Client('dPWRqD2QNxdHqbeOsG3Ib4KPda420RnpemnCcMql')
# Document class
class Documents:

    def __init__(self, sources: List[Dict[str, str]]):
        self.sources = sources  # all sources not chunked
        self.docs = []  # chunked sources
        self.docs_embs = []  # embedded + chunked
        self.retrieve_top_k = 10
        self.rerank_top_k = 3
        self.load()
        self.embed()
        self.index()

    def loadGeneral(self, source):
        if source["path"].endswith(".pdf"):
            loader = PyPDFLoader(source['path'])
        elif source["path"].endswith(".docx"):
            loader = Docx2txtLoader(source["path"])
        elif source["path"].endswith(".pptx"):
            loader = UnstructuredPowerPointLoader(source["path"])

        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100, add_start_index=True)
        all_splits = text_splitter.split_documents(docs)
        for split in all_splits:
            self.docs.append(
                {
                    "title": source["title"],
                    "text": split.page_content,
                    "path": source["path"]
                }
            )

    def loadCSV(self, source):
        loader = CSVLoader(
            file_path=source["path"],
            csv_args={
                "delimiter": ",",
                "quotechar": '"',
            },
        )

        data = loader.load()
        for doc in data:
            self.docs.append(
                {
                    "title": source["title"],
                    "text": doc.page_content,
                    "path": source["path"]
                }
            )

    def load(self):
        print("loading docs")
        for source in self.sources:
            if source["path"].endswith(".pdf") or source["path"].endswith(".docx") or source["path"].endswith(
                    ".pptx"):
                self.loadGeneral(source)
            else:
                self.loadCSV(source)

    def embed(self):
        print("embedding docs")
        batch_size = 90
        self.docs_len = len(self.docs)
        print(self.docs_len)
        for i in range(0, self.docs_len, batch_size):
            batch = self.docs[i: min(i + batch_size, self.docs_len)]
            texts = [item["text"] for item in batch]
            docs_embs_batch = co.embed(
                texts=texts,
                model="embed-english-v3.0",
                input_type="search_document"
            ).embeddings
            self.docs_embs.extend(docs_embs_batch)

    def index(self):
        print("Indexing documents...")

        self.index = hnswlib.Index(space="ip", dim=1024)
        self.index.init_index(max_elements=self.docs_len, ef_construction=512, M=64)
        self.index.add_items(self.docs_embs, list(range(len(self.docs_embs))))

        print(f"Indexing complete with {self.index.get_current_count()} documents.")

    def retrieve(self, query: str) -> List[Dict[str, str]]:
        """
        Retrieves documents based on the given query.

        Parameters:
        query (str): The query to retrieve documents for.

        Returns:
        List[Dict[str, str]]: A list of dictionaries representing the retrieved  documents, with 'title', 'snippet', and 'url' keys.
        """
        docs_retrieved = []
        query_emb = co.embed(
            texts=[query],
            model="embed-english-v3.0",
            input_type="search_query"
        ).embeddings

        doc_ids = self.index.knn_query(query_emb, k=self.retrieve_top_k)[0][0]
        docs_to_rerank = []
        for doc_id in doc_ids:
            docs_to_rerank.append(self.docs[doc_id]["text"])

        rerank_results = co.rerank(
            query=query,
            documents=docs_to_rerank,
            top_n=self.rerank_top_k,
            model="rerank-english-v2.0",
        )

        doc_ids_reranked = []
        for result in rerank_results:
            doc_ids_reranked.append(doc_ids[result.index])

        for doc_id in doc_ids_reranked:
            docs_retrieved.append(
                {
                    "title": self.docs[doc_id]["title"],
                    "text": self.docs[doc_id]["text"],
                    "path": self.docs[doc_id]["path"],
                }
            )

        return docs_retrieved