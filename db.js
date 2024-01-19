import mongoose from "mongoose";
mongoose.set("strictQuery", true);

async function connectToDatabase() {
  try {
    const connection = await mongoose.connect(
      "mongodb://127.0.0.1:27017/kingkongf",
      {}
    );
    console.log(connection);
  } catch (err) {
    console.error(err);
  }
}

export { connectToDatabase };
