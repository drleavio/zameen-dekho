import mongoose from 'mongoose';

export const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb+srv://drleavio:CP74UmKda2yIJiKe@cluster0.k9sm2do.mongodb.net/zameen-dekho?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};