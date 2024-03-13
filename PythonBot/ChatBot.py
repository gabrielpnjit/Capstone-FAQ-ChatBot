import cohere
import uuid
from typing import List, Dict
from DocLoader import Documents
import os
CTOKEN = os.getenv('COHERE_TOKEN')

co = cohere.Client('dPWRqD2QNxdHqbeOsG3Ib4KPda420RnpemnCcMql')

# example local sources
sources = [

    {
        "title": "Schedule",
        "path": "LIVESCHEDULE.csv"
    },
    {
        "title": "handbook",
        "path": "handbook.pdf"
    }]
docs = Documents(sources)

class Chatbot:
    def __init__(self, docs: Documents):
        self.docs = docs
        self.conversation_id = str(uuid.uuid4())

    def generate_response(self, message: str):
        message += " You should reply as a FAQ Bot who is helping an NJIT Capstone course, keep your response short and precise"
        # Generate search queries (if any)
        response = co.chat(message=message, search_queries_only=True)
        # If there are search queries, retrieve documents and respond
        if response.search_queries:
            #   print("Retrieving information...")

            documents = self.retrieve_docs(response)

            response = co.chat(
                message=message,
                documents=documents,
                conversation_id=self.conversation_id,
                stream=True
            )
            for event in response:
                yield event
            yield response

        # If there is no search query, directly respond
        else:
            response = co.chat(
                message=message,
                conversation_id=self.conversation_id,
                stream=True         
            )
            for event in response:
                yield event

    def retrieve_docs(self, response) -> List[Dict[str, str]]:

        # Get the query(s)
        queries = []
        for search_query in response.search_queries:
            queries.append(search_query["text"])

        # Retrieve documents for each query
        retrieved_docs = []
        for query in queries:
            retrieved_docs.extend(self.docs.retrieve(query))

        return retrieved_docs