import { pc, pcIndex } from "./db/connection-pinecone.js";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
const pinecone = new Pinecone();

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
// try {
//     await pcIndex.namespace('').deleteAll();
//     console.log("Successful");
//   } catch (err) {
//     console.error(err);
//     console.log("Error");
//   }

// load documents
const loader = new PDFLoader("test_docs/Capstone-Handbook.pdf");
const docs = await loader.load();
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