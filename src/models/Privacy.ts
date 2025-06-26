import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// TypeScript interface for the document
export interface IPrivacy extends Document {
  description?: string;
  description_ta?: string;
  created_at?: Date;
  updated_at?: Date;
  is_delete?: boolean;
}

// Schema definition
const PrivacySchema = new Schema<IPrivacy>({
  description: { type: String, required: false, text: true },
  description_ta: { type: String, required: false, text: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false },
}, {
  collection: "privacy_policy",
});

// Model creation
const Privacy: Model<IPrivacy> = models.privacy_policy || model<IPrivacy>("privacy_policy", PrivacySchema);

export default Privacy;
