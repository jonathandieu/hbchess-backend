import express from "express";
const app = express();
const port = process.env.PORT || 8080; // Listening port defaults to 8080 if there's no env port

// MongoDB Setup
const MongoClient = require('mongodb').MongoClient;
const ATLAS_URI = "mongodb+srv://main-cluster.bvdg5.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority"; // DB URL
const credentials = "./secrets/X509-cert-9030528069491104300.pem"; // Path to the credentials file //? This is relative path from server.js in build

// This is the secure certificate way to access the DB
// const client = new MongoClient(ATLAS_URI, {
//     sslKey: credentials,
//     sslCert: credentials,
//     // serverApi: ServerApiVersion.v1
// });
// This is the unsecure way with password hardcoded in
const client = new MongoClient("mongodb+srv://<username>:<password>@main-cluster.bvdg5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
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
