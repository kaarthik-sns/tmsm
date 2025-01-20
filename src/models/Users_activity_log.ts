import mongoose, { Schema, model, models } from "mongoose";

const users_activity_log_Schema = new Schema({
  user_id: { type: String, required: true },
  desc: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
}, { collection: "users_activity_log" });

// Get user by name
users_activity_log_Schema.statics.getByUserID = function (id: string) {
  return this.findOne({ user_id: id });
};

const users_activity_log = models.users_activity_log || model("users_activity_log", users_activity_log_Schema);

export default users_activity_log;