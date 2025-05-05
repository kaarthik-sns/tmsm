import mongoose, { Schema, model, models } from "mongoose";

const FaqSchema = new Schema({
  title: { type: String, required: false },
  description: { type: String, required: false, text: true },
  title_ta: { type: String, required: false },
  description_ta: { type: String, required: false, text: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false },
});

// Get faq by title
FaqSchema.statics.getByTitle = function (title: string) {
  return this.findOne({ title });
};


const Faq = models.faqs || model("faqs", FaqSchema);

export default Faq;