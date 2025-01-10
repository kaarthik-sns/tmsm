import mongoose, { Schema, model, models } from "mongoose";

const RequestsSchema = new Schema({
  sender_id: { type: String, required: true },
  receiver_id: { type: String, required: true },
  status: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date, default: Date.now }
}, { collection: "requests" });

// Get Requests by id
RequestsSchema.statics.getById = function (id: string) {
  return this.findOne({ _id: id });
}

// Get Requests by sender id
RequestsSchema.statics.getBySenderId = function (id: string) {
  return this.findOne({ sender_id: id });
}

// Get Requests by receiver id
RequestsSchema.statics.getByReceiverId = function (id: string) {
  return this.findOne({ receiver_id: id });
}

const profile_requests = models.ProfileRequests || model("profile_requests", RequestsSchema);

export default profile_requests;