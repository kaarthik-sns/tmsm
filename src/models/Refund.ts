import mongoose, { Schema, model, models } from "mongoose";

const RefundSchema = new Schema({
  description: { type: String, required: false, text: true }, // description as text
  description_ta: { type: String, required: false, text: true }, // description as text
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false }, // admin approved or not status
}, { collection: "refund_plolicy" });

const Refund = models.refund_plolicy || model("refund_plolicy", RefundSchema);

export default Refund;