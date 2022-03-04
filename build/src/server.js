"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080; // Listening port defaults to 8080 if there's no env port
var User = require('./model/user');
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
