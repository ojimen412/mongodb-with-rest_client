const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

app.use(express.json());

// Connect to MongoDB before starting the server
async function startServer() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit the process if the connection fails
    }
}

startServer();

// Create (Insert) endpoint
app.post("/insert", async (req, res) => {
    try {
        const { collection, document } = req.body;
        const db = client.db("myDatabase");
        const result = await db.collection(collection).insertOne(document);
        res.status(201).send(`Document inserted with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read (Find) endpoint
app.get("/find/:collection", async (req, res) => {
    try {
        const { collection } = req.params;
        const db = client.db("myDatabase");
        const documents = await db.collection(collection).find({}).toArray();
        res.status(200).json(documents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete endpoint
app.delete("/delete/:collection/:id", async (req, res) => {
    try {
        const { collection, id } = req.params;
        const db = client.db("myDatabase");
        const result = await db
            .collection(collection)
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            res.status(200).send(`Document with ID ${id} deleted successfully.`);
        } else {
            res.status(404).send(`Document with ID ${id} not found.`);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});