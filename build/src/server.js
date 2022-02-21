"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080; // Listening port defaults to 8080 if there's no env port
// MongoDB Setup
const MongoClient = require('mongodb').MongoClient;
const ATLAS_URI = "mongodb+srv://main-cluster.bvdg5.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority"; // DB URL
const client = new MongoClient(ATLAS_URI);
client.connect();
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const database = client.db("testDB");
            const collection = database.collection("testCol");
            const docCount = yield collection.countDocuments({});
            console.log(docCount);
            // perform actions using client
        }
        finally {
            // Ensures that the client will close when you finish/error
            yield client.close();
        }
    });
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
