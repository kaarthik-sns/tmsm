import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// TypeScript interface for the document
export interface IcontactTemplate extends Document {
  description?: string;
  description_ta?: string;
  created_at?: Date;
  updated_at?: Date;
  is_delete?: boolean;
}

// Define the schema with types
const contactSchema = new Schema<IcontactTemplate>({
  description: { type: String, required: false, text: true },
  description_ta: { type: String, required: false, text: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false },
}, {
  collection: "contact_us_templates",
});

// Create and export the model
const contactTemplateModel: Model<IcontactTemplate> =
  models.contactTemplate || model<IcontactTemplate>("contactTemplate", contactSchema);

export default contactTemplateModel;
