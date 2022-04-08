/* eslint-disable no-console */
import { app, httpServer } from "./setUpServer";
import connectDB from "./db";

connectDB();

const apiPort = process.env.PORT || 8080; // Listening port defaults to 8080 if there's no env port
// Start express server
app.listen(apiPort, () => {
  console.log(`server started at http://localhost:${apiPort}`);
});

const wsPort = process.env.WS_PORT || 65080;
httpServer.listen(wsPort, () => {
  console.log(`Api and Socket.io listening on port ${wsPort}!`);
});
