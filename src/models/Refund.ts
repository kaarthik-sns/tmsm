import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// TypeScript interface for the document
export interface IRefundPolicy extends Document {
  description?: string;
  description_ta?: string;
  created_at?: Date;
  updated_at?: Date;
  is_delete?: boolean;
}

// Define the schema with types
const RefundSchema = new Schema<IRefundPolicy>({
  description: { type: String, required: false, text: true },
  description_ta: { type: String, required: false, text: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false },
}, {
  collection: "refund_policy",
});

// Create and export the model
const Refund: Model<IRefundPolicy> =
  models.refund_policy || model<IRefundPolicy>("refund_policy", RefundSchema);

export default Refund;
