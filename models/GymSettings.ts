import mongoose, { Schema, Document } from "mongoose";
import { USE_MEMORY_DB, MemoryGymSettings } from "@/lib/inMemoryDB";

export interface GymSettingsDocument extends Document {
  slug: string;
  name: string;
  emoji: string;
}

const GymSettingsSchema = new Schema<GymSettingsDocument>({
  slug: { type: String, required: true, unique: true, default: "default" },
  name: { type: String, required: true, default: "FullFutbol" },
  emoji: { type: String, required: true, default: "🏋️" },
});

const MongoGymSettings =
  mongoose.models.GymSettings || mongoose.model<GymSettingsDocument>("GymSettings", GymSettingsSchema);

export default (USE_MEMORY_DB ? MemoryGymSettings : MongoGymSettings) as any;
