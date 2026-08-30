import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.log("No database URI provided. Running in resilient in-memory mode.");
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log("Connected to database successfully.");
  } catch (error) {
    console.warn("Database connection warning: Running in resilient in-memory mode.");
  }
}

export function getDbStatus() {
  return isConnected;
}
