const express = require('express');
const app = express();
const port = 8080; // Default listening port

// Define route handler for the default home page
app.get("/", (req, res) => {
    res.send("Woooohooo we're setting stuff up!");
} );

app.get("/testendpoint", (req, res) => {
    res.json({ message : "Woooohooo we're setting stuff up AND our endpoint works!", status : 418 });
} );

// Start express server
app.listen(port, () => {
    console.log( `server started at http://localhost${ port }`);
} );