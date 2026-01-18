import mongoose from "mongoose";
;

const MONGODB_URI = process.env.MONGODB_URI?.replace('<password>', process.env.MONGODB_PASSWORD || '') as string;
let clientPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return mongoose;
  if (!clientPromise) {
    clientPromise = mongoose.connect(MONGODB_URI);
  }
  await clientPromise;
  return mongoose;
}

