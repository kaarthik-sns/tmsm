import mongoose, { Schema, model, models } from "mongoose";

const PaymentSchema = new Schema({
    userId: { type: String, required: true },
    subscriptionId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["success", "failed", "pending"], required: true },
    transactionId: { type: String, required: true, unique: true },
    paidAt: { type: Date },
    created_at: { type: Date, default: Date.now }
}, { collection: "payments" });

const Payment = models.Payment || model("Payment", PaymentSchema);
export default Payment;
