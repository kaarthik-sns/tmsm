import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Enum for payment status
export type PaymentStatus = "success" | "failed" | "pending";

// Document interface
export interface IPayment extends Document {
  userId: string;
  subscriptionId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  transactionId: string;
  paidAt?: Date;
  created_at?: Date;
}

// Schema definition
const PaymentSchema = new Schema<IPayment>({
  userId: { type: String, required: true },
  subscriptionId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["success", "failed", "pending"],
    required: true,
  },
  transactionId: { type: String, required: true, unique: true },
  paidAt: { type: Date },
  created_at: { type: Date, default: Date.now },
}, {
  collection: "payments",
});

// Model creation
const Payment: Model<IPayment> = models.Payment || model<IPayment>("Payment", PaymentSchema);

export default Payment;
