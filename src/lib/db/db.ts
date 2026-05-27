import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URL_ONLINE!;
if (!MONGODB_URI) throw new Error("Please define DB_URL_ONLINE in .env");

let cached = global.mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectToDB() {
  if (cached?.conn) return cached.conn;
  if (!cached?.promise) cached!.promise = mongoose.connect(MONGODB_URI);
  cached!.conn = await cached!.promise;
  return cached!.conn;
}
