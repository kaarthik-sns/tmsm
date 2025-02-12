import mongoose, { Schema, model, models } from "mongoose";

const TermsSchema = new Schema({
    description: { type: String, required: false, text: true }, // description as text
    created_at: { type: Date,  default: Date.now  },
    updated_at: { type: Date, default: Date.now },
    is_delete: { type: Boolean, default: false }, // admin approved or not status

});

// Get terms by title
TermsSchema.statics.getByTitle = function (title: string) {
  return this.findOne({ title });
};

const Terms = models.terms_conditions || model("terms_conditions", TermsSchema);

export default Terms;