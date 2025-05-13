import mongoose, { Schema, model, models } from "mongoose";

const SubscriptionSchema = new Schema({
  userId: { type: String, required: true },
  planName: { type: String, required: true }, // e.g., 'basic', 'premium'
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "cancelled", "expired"], default: "active" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { collection: "subscriptions" });

const Subscription = models.Subscription || model("Subscription", SubscriptionSchema);
export default Subscription;
