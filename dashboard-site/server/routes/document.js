import express from "express";

import multer from "multer";
import { Blob } from 'buffer';
import { pc, pcIndex } from "../db/connection-pinecone.js";
import { File, Logs } from '../db/connection.js';
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { BufferLoader } from "langchain/document_loaders/fs/buffer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import path from 'path';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Placeholder that returns pinecone index data
router.get("/", async (req, res) => {
  let indexes = await pc.listIndexes();
  let results = indexes;
  res.send(results).status(200);
});

// Test route, this deletes all vectors in db right now without needing to do a post request
router.get("/test", async (req, res) => {
  try {
    await pcIndex.namespace('').deleteAll();
    res.send(result).status(200);
    console.log("Successful")
  } catch (err) {
    console.log("Error deleting vectors")
    console.error(err);
    res.status(500).send("Error deleting vectors");
  }
});

router.get('/viewFiles', async(req,res)=>{
  try {
    const files= await File.find();
    res.send(files).status(200);
  }
  catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
}
})

router.get('/viewLogs', async(req,res)=>{
  try {
    const logs= await Logs.find();
    res.send(logs).status(200);
  }
  catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
}
})

// Upload document
router.post("/", upload.single('file'), async (req, res) => {
  if (!req.file) {
      return res.status(400).send("No file uploaded");
  }

  try {
    // pinecone db connection and index
    const pinecone = pc;
    const pineconeIndex = pcIndex;

    // load documents
    // only handling one file at a time of types pdf, txt, csv
    const buffer = req.file.buffer;
    //console.log(req.file)
    const blob = new Blob([buffer], { source: req.file.originalname }); // loaders can only handle blobs, not buffers
    const extension = path.extname(req.file.originalname).toLowerCase();
    let loader;
    let docs;
    switch (extension) {
        case '.pdf':
            console.log("Processing pdf...");
            loader = new PDFLoader(blob);
            docs = await loader.load();
            break;
        case '.txt':
            console.log("Processing txt...");
            loader = new TextLoader(blob);
            docs = await loader.load();
            break;
        case '.csv':
            console.log("Processing csv...");
            loader = new CSVLoader(blob);
            docs = await loader.load();
            break;
        default:
            console.log("ERROR: Invalid file type! Only accepting pdf, txt, csv files");
    }
    // docs is an array and i cant upload that so we have to join
    const mongotext = docs.map(doc => doc.pageContent).join('\n');
    const newFile = new File({
      filename: req.file.originalname,
      content: mongotext
     });
    await newFile.save();
    console.log("File saved to MongoDB:", newFile);

    // const pages = await loader.loadAndSplit() // i don't think this is needed
    for (let i = 0; i < docs.length; i++) {
        docs[i].metadata.source = req.file.originalname;
    }
    //console.log(docs)
    // split
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkOverlap: 200,
        chunkSize: 500
    });

    const allSplits = await textSplitter.splitDocuments(docs, { chunkHeader: req.file.originalname })

    // add to pinecone vector db
    let result = await PineconeStore.fromDocuments(allSplits, new OpenAIEmbeddings(), {
      pineconeIndex,
      maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    }).then(res => {
      console.log("Successfully Uploaded to Pinecone DB!")
    }).catch(err => {
      console.log("Error uploading to pinecone DB!")
      console.log(err)
    })

    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading document to Pinecone Database");
  }
});

// DELETES ALL FROM INDEX
router.delete("/delete", async (req, res) => {
  try {
    await pcIndex.delete1({ deleteAll: true, namespace, });
    res.send(result).status(200);
    console.log("Successful")
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting vectors");
    console.log("Error")
  }
});

export default router;