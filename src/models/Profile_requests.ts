import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Enum type (optional if you want to restrict status)
export type RequestStatus = "pending" | "accepted" | "rejected";

// Interface for document
export interface IProfileRequest extends Document {
  sender_id: string;
  receiver_id: string;
  status?: RequestStatus;
  created_at?: Date;
  updated_at?: Date;
}

// Schema definition
const RequestsSchema = new Schema<IProfileRequest>(
  {
    sender_id: { type: String, required: true },
    receiver_id: { type: String, required: true },
    status: { type: String, default: "pending" }, // Optionally add enum validation
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: "requests",
  }
);

// Optional: Add an index for faster lookups
RequestsSchema.index({ sender_id: 1, receiver_id: 1 }, { unique: true });

// Create model
const ProfileRequests: Model<IProfileRequest> =
  models.profile_requests || model<IProfileRequest>("profile_requests", RequestsSchema);

export default ProfileRequests;
