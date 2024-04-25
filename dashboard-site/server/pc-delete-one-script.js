import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { pc, pcIndex } from "./db/connection-pinecone.js";

const pinecone = pc;
const pineconeIndex = pcIndex
const embeddings = new OpenAIEmbeddings();
const pineconeStore = new PineconeStore(embeddings, { pineconeIndex });

const pageContent = "hi";

const results = await pineconeStore.similaritySearchWithScore(pageContent, 2, {
    source: "Capstone-Handbook.pdf",
});

console.log(results[0]);

// const deleted = await pineconeStore.delete({
//   ids: [ids[0], ids[1]],
// });

// console.log(deleted)
/*
[
  Document {
    pageContent: 'pinecone is a vector db',
    metadata: { foo: 'bar' },
  },
  Document {
    pageContent: "the quick brown fox jumped over the lazy dog",
    metadata: { foo: "bar" },
  }
]
*/

// await pineconeStore.delete({
//   ids: [ids[0], ids[1]],
// });

// const results2 = await pineconeStore.similaritySearch(pageContent, 2, {
//   foo: "bar",
// });

// console.log(results2);
/*
  []
*/