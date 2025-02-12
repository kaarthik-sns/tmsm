import mongoose, { Schema, model, models } from "mongoose";

const PrivacySchema = new Schema({
  description: { type: String, required: false, text: true }, // description as text
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false }, // admin approved or not status

}, { collection: "privacy_plolicy" });

const Privacy = models.privacy_plolicy || model("privacy_plolicy", PrivacySchema);

export default Privacy;