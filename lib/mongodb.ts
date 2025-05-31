import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected to db");
    return;
  }
  try {
    const dbCon = await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "NoteFusion",
    });
    connection.isConnected = dbCon.connections[0].readyState;
    console.log("DB connected succesfully");
  } catch (err) {
    console.log(err, "DB Connection Faied");
  }
}

export default dbConnect;
