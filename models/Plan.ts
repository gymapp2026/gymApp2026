import mongoose, { Schema, Document } from "mongoose";

export interface PlanDocument extends Document {
  name: string;
  price: number;
  currency: string;
  features: string[];
  duration: "monthly" | "yearly";
  isActive: boolean;
}

const PlanSchema = new Schema<PlanDocument>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "ARS" },
    features: [{ type: String }],
    duration: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model<PlanDocument>("Plan", PlanSchema);
