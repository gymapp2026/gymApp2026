import mongoose, { Schema, Document } from "mongoose";
import { USE_MEMORY_DB, MemoryGymSession } from "@/lib/inMemoryDB";

export interface GymSessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  routineId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const GymSessionSchema = new Schema<GymSessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    routineId: { type: Schema.Types.ObjectId, ref: "Routine" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

GymSessionSchema.index({ userId: 1, date: 1 }, { unique: true });

const MongoGymSession =
  mongoose.models.GymSession || mongoose.model<GymSessionDocument>("GymSession", GymSessionSchema);

export default (USE_MEMORY_DB ? MemoryGymSession : MongoGymSession) as any;
