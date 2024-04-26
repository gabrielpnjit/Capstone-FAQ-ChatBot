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
import mongoose from "mongoose";

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
    console.log("Successful");
  } catch (err) {
    console.log("Error deleting vectors");
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
});

router.get('/viewLogs', async(req,res)=>{
  try {
    const logs= await Logs.find();
    res.send(logs).status(200);
  }
  catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
}
});

// Upload document
router.post("/", upload.single('file'), async (req, res) => {
  if (!req.file) {
      return res.status(400).send("No file uploaded");
  }

  try {
    // pinecone db connection and index
    const pinecone = pc;
    const pineconeIndex = pcIndex;
    const { documentName, sourceLocation } = req.body;
    const SourceLink=sourceLocation||req.file.originalname;
    // load documents
    // only handling one file at a time of types pdf, txt, csv
    const buffer = req.file.buffer;
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
    const SharedID= new mongoose.Types.ObjectId;
    const mongotext = docs.map(doc => doc.pageContent).join('\n');    // docs is an array and i cant upload that so we have to join
    const newFile = new File({
      SharedID: SharedID,
      filename: documentName || req.file.originalname, // Eh, this is for mongodb just gonna leave it in here
      content: mongotext,
      source: SourceLink
     });
    await newFile.save();
    console.log("File saved to MongoDB:");
    // const pages = await loader.loadAndSplit() // i don't think this is needed
    for (let i = 0; i < docs.length; i++) {
        docs[i].metadata.source = SourceLink;
        docs[i].metadata.sourceName = documentName || req.file.originalname;
    }

    // console.log(docs)
    // split
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkOverlap: 200,
        chunkSize: 500
    });
    const allSplits = await textSplitter.splitDocuments(docs, { chunkHeader: req.file.originalname});
    // add to pinecone vector db
    const pineSharedID=SharedID.toString();
    let result = await PineconeStore.fromDocuments(allSplits, new OpenAIEmbeddings(),{
      pineconeIndex,
      maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    }).then(res => {
      console.log("Successfully Uploaded to Pinecone DB!");
    }).catch(err => {
      console.log("Error uploading to pinecone DB!");
      console.log(err);
    })

    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading document to Pinecone Database");
  }
});
// Delete All Files
router.delete("/deleteAll", async (req, res) => {
  try {
    await File.deleteMany({}); 
    await pcIndex.namespace('').deleteAll();
    res.status(200).send("File deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting file");
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    await Logs.findByIdAndDelete(fileId)
    res.status(200).send("deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting");
  }
  
});

router.delete("/deleteAllLogs", async (req, res) => {
  try {
    await Logs.deleteMany({}); 
    console.log("Delete all")
    res.status(200).send("File deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting file");
  }
});
/*
// Re-upload documents from MongoDB to Pinecone after clearing the database
// this is truely cursed 
router.post("/reupload", async (req, res) => {
  try {
    const pinecone = pc;
    const pineconeIndex = pcIndex;
    // Fetch all documents from MongoDB
    const files = await File.find();
    for (const file of files) { // For every item in the database

      const { content, source } = file; // Get the resources
      
      const doc = { metadata: { source }, content };    // Create a new document object 
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkOverlap: 200,
        chunkSize: 500
      });
      console.log(doc,"\n\n\n\n\n\n")
      const splits = await textSplitter.splitDocuments([doc], { chunkHeader: file.filename });
      console.log(splits)
      await PineconeStore.fromDocuments(splits, new OpenAIEmbeddings(), {
        pineconeIndex,
        maxConcurrency: 5,
      });
    }
    res.status(200).send("Successfully Delete/reupload");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error delete/reupload");
  }
});

// Delete specific file by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    await File.findByIdAndDelete(fileId)
    await pcIndex.namespace('').deleteAll();
    res.status(200).send("File deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting file");
  }
  
});
*/
export default router;