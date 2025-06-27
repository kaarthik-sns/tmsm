import mongoose, { Schema, model, models, Document } from "mongoose";

// Define the interface for the document
export interface IContactUsTemplate extends Document {
  description?: string;
  description_ta?: string;
  created_at?: Date;
  updated_at?: Date;
  is_delete: boolean;
}

// Define the schema
const ContactUsTemplateSchema = new Schema<IContactUsTemplate>(
  {
    description: { type: String, required: false, text: true },
    description_ta: { type: String, required: false, text: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_delete: { type: Boolean, default: false },
  },
  {
    collection: "contact_us_templates", // Correct collection name
  }
);

// Create the model
const ContactUsTemplate =
  models.ContactUsTemplate ||
  model<IContactUsTemplate>("ContactUsTemplate", ContactUsTemplateSchema);

export default ContactUsTemplate;
