import express from "express";
const app = express();
const port = process.env.PORT || 8080; // Listening port defaults to 8080 if there's no env port

// MongoDB Setup
const MongoClient = require('mongodb').MongoClient;
const ATLAS_URI = "mongodb+srv://main-cluster.bvdg5.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority"; // DB URL
const credentials = '' // Path to the credentials file
const client = new MongoClient(ATLAS_URI);
client.connect();

async function run() {
  try {
    await client.connect();
    const database = client.db("testDB");
    const collection = database.collection("testCol");
    const docCount = await collection.countDocuments({});
    console.log(docCount);
    // perform actions using client
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// Define route handler for the default home page
app.get("/api", (req, res) => {
  res.send("Woooohooo we're setting stuff up!");
});

app.get("/api/testendpoint", (req, res) => {
  res.json({
    message: "Woooohooo we're setting stuff up AND our endpoint works!",
    status: 418,
    testing: "TESTING! (With TypeScript & Automatic Deployment)",
  });
});

// Start express server
app.listen(port, () => {
  console.log(`server started at http://localhost${port}`);
});
