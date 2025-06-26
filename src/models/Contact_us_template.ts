import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Define the interface for the document
export interface IContactUsTemplate extends Document {
  description?: string;
  description_ta?: string;
  created_at?: Date;
  updated_at?: Date;
  is_delete?: boolean;
}

// Define the interface for the model including statics
interface IContactUsTemplateModel extends Model<IContactUsTemplate> {
  getByTitle(title: string): Promise<IContactUsTemplate | null>;
}

// Create the schema
const ContactUsTemplateSchema = new Schema<IContactUsTemplate>({
  description: { type: String, required: false, text: true },
  description_ta: { type: String, required: false, text: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false },
}, {
  collection: "contact_us_templates",
});

// Create the model
const ContactUsTemplate = (models.contact_us_template as IContactUsTemplateModel) ||
  model<IContactUsTemplate, IContactUsTemplateModel>("contact_us_templates", ContactUsTemplateSchema);

export default ContactUsTemplate;
