import mongoose, { Schema, model, models } from "mongoose";

const FaqSchema = new Schema({
    title: { type: String, required: true }, // name as text for full-text search
    description: { type: String, required: false, text: true }, // description as text
    created_at: { type: Date,  default: Date.now  },
    updated_at: { type: Date, default: Date.now },
    is_delete: { type: Boolean, default: false }, // admin approved or not status

});

// Get faq by title
FaqSchema.statics.getByTitle = function (title: string) {
  return this.findOne({ title });
};

// Get faq by id
FaqSchema.statics.getById = function (id: string) {
  return this.findOne({ _id: id });
}


const Faq = models.faqs || model("faqs", FaqSchema);

export default Faq;