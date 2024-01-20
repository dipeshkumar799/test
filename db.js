import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/cobra", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
