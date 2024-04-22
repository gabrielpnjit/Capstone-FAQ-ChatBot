import { pc, pcIndex } from "./db/connection-pinecone.js";

try {
    await pcIndex.namespace('').deleteAll();
    console.log("Successful")
  } catch (err) {
    console.error(err);
    console.log("Error, Pinecone index may already be empty!")
}