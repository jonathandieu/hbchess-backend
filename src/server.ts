/* eslint-disable no-console */
import app from "./setUpServer";
import connectDB from "./db";

connectDB();
const port = process.env.PORT || 8080; // Listening port defaults to 8080 if there's no env port

// Start express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

export default app;
