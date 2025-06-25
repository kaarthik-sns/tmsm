import mongoose, { Schema, model, models } from "mongoose";

const ContactUsTemplateSchema = new Schema({
  description: { type: String, required: false, text: true }, // description as text
  description_ta: { type: String, required: false, text: true }, // description as text
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false }, // admin approved or not status
});

// Get terms by title
ContactUsTemplateSchema.statics.getByTitle = function (title: string) {
  return this.findOne({ title });
};

const ContactUsTemplate = models.contact_us_template || model("contact_us_template", ContactUsTemplateSchema);

export default ContactUsTemplate;