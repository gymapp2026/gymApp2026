import mongoose from "mongoose";
import { USE_MEMORY_DB } from "@/lib/inMemoryDB";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/gymapp";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache;
}

const cache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export async function connectDB() {
  if (USE_MEMORY_DB) return; // modo memoria, sin conexión real

  // readyState 1 = connected. Si no está conectado, resetear caché y reconectar.
  if (cache.conn && mongoose.connection.readyState === 1) {
    return cache.conn;
  }

  // Conexión caída o inexistente — limpiar caché y reconectar
  cache.conn = null;
  cache.promise = null;

  cache.promise = mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  }).then((m) => m);

  cache.conn = await cache.promise;
  return cache.conn;
}
