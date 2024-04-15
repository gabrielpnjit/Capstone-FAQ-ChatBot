import { Pinecone } from '@pinecone-database/pinecone';

const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "";
const PINECONE_INDEX = process.env.PINECONE_INDEX || "";

const pc = new Pinecone({
  apiKey: PINECONE_API_KEY,
});
const pcIndex = pc.Index(PINECONE_INDEX);

export { pc, pcIndex };