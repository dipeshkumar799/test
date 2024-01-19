import express from "express";
import { connectToDatabase } from "./getting-started";
connectToDatabase(); // Call the database connection function

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () =>
  console.log(`Server is running on port at http://localhost:${port}`)
);
