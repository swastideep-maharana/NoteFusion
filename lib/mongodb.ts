import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const MONGODB_URI = process.env.MONGODB_URI;

interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "NoteFusion",
    });

    connection.isConnected = db.connections[0].readyState;

    if (process.env.NODE_ENV === "development") {
      console.log("MongoDB connected successfully");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

// For development environment: Handle connection hot reloading
if (process.env.NODE_ENV === "development") {
  mongoose.set("debug", true);
}

export default dbConnect;
