import mongoose, { Schema, Document } from "mongoose";

const RoutineExerciseSchema = new Schema({
  exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise", required: true },
  sets: { type: Number, default: 3 },
  reps: { type: Number, default: 10 },
  rest: { type: Number, default: 60 },
  notes: { type: String },
});

const RoutineDaySchema = new Schema({
  day: { type: String, required: true },
  exercises: [RoutineExerciseSchema],
});

export interface RoutineDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  days: typeof RoutineDaySchema[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoutineSchema = new Schema<RoutineDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    days: [RoutineDaySchema],
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Routine || mongoose.model<RoutineDocument>("Routine", RoutineSchema);
