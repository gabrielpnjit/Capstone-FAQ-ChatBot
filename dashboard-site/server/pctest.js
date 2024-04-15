import { pc, pcIndex } from "./db/connection-pinecone.js";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import path from 'path';

// pinecone db connection and index
const pinecone = pc;
const pineconeIndex = pcIndex;

// load documents
// only handling one file at a time of types pdf, txt, csv
const filePath = "test_docs/Capstone-Handbook.pdf"
const extension = path.extname(filePath);
let loader;
let docs;
switch (extension) {
    case '.pdf':
        console.log("Processing pdf...");
        loader = new PDFLoader(filePath);
        docs = await loader.load();
        break;
    case '.txt':
        console.log("Processing txt...");
        loader = new TextLoader(filePath);
        docs = await loader.load();
        break;
    case '.csv':
        console.log("Processing csv...");
        loader = new CSVLoader(filePath);
        docs = await loader.load();
        break;
    default:
        console.log("ERROR: Invalid file type! Only accepting pdf, txt, csv files");
}
// const pages = await loader.loadAndSplit() // i don't think this is needed

// split
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkOverlap: 200,
    chunkSize: 500
});

const allSplits = await textSplitter.splitDocuments(docs)

// add to pinecone vector db
await PineconeStore.fromDocuments(allSplits, new OpenAIEmbeddings(), {
    pineconeIndex,
    maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
  });