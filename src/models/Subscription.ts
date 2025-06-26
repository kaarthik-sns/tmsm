import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Enum for subscription status
export type SubscriptionStatus = "active" | "cancelled" | "expired";

// TypeScript interface for Subscription document
export interface ISubscription extends Document {
  userId: string;
  planName: string;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
  created_at?: Date;
  updated_at?: Date;
}

// Schema definition
const SubscriptionSchema = new Schema<ISubscription>({
  userId: { type: String, required: true },
  planName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["active", "cancelled", "expired"],
    default: "active",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, {
  collection: "subscriptions",
});

// Model creation with typing
const Subscription: Model<ISubscription> =
  models.Subscription || model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;