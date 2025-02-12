import mongoose, { Schema, model, models } from "mongoose";

const RequestsSchema = new Schema(
  {
    sender_id: { type: String, required: true },
    receiver_id: { type: String, required: true },
    status: { type: String, default: "pending" },
    created_at: { type: Date, default: Date.now }, // Automatically set creation time
    updated_at: { type: Date, default: Date.now }  // Automatically set update time
  },
  { collection: "requests" } // Specify the collection name explicitly
);

// Static method: Get Requests by sender_id
RequestsSchema.statics.getBySenderId = function (id: string) {
  return this.findOne({ sender_id: id });
};

// Static method: Get Requests by receiver_id
RequestsSchema.statics.getByReceiverId = function (id: string) {
  return this.findOne({ receiver_id: id });
};

// Check if the model already exists; otherwise, define it
const ProfileRequests = models.profile_requests || model("profile_requests", RequestsSchema);

export default ProfileRequests;
