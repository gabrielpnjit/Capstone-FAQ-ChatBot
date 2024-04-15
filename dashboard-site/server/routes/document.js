import express from "express";

// This will help us connect to the database
import { pc, pcIndex } from "../db/connection-pinecone.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// Placeholder that returns pinecone index data
router.get("/", async (req, res) => {
  let indexes = await pc.listIndexes();
  let results = indexes;
  res.send(results).status(200);
});

// Test route
router.get("/test", async (req, res) => {
  try {
    await pcIndex.namespace('default').deleteAll();
    res.send(result).status(200);
    console.log("Successful")
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting vectors");
    console.log("Error")
  }
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// DELETES ALL FROM INDEX
router.delete("/tests", async (req, res) => {
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