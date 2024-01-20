import express from "express";
import authRoutes from "./routes/Auth.js";
import authNotes from "./routes/notes.js";

import connectDB from "./db.js";
connectDB();
const app = express();
const port = 4000;
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", authNotes);
app.listen(port, () =>
  console.log(`Server is running on port at http://localhost:${port}`)
);
