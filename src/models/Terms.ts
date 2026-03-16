import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Document interface
export interface ITerms extends Document {
  description?: string;
  description_ta?: string;
  created_at?: Date;
  updated_at?: Date;
  is_delete?: boolean;
}

// Model interface with statics
interface ITermsModel extends Model<ITerms> {
  getByTitle(title: string): Promise<ITerms | null>;
}

// Schema definition
const TermsSchema = new Schema<ITerms>({
  description: { type: String, required: false, text: true },
  description_ta: { type: String, required: false, text: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false },
}, {
  collection: "terms_conditions",
});

// Static method to get by title (although `title` is not defined — optional fix below)
TermsSchema.statics.getByTitle = function (title: string) {
  return this.findOne({ title });
};

// Create and export the model
const Terms: ITermsModel =
  (models.terms_conditions as ITermsModel) || model<ITerms, ITermsModel>("terms_conditions", TermsSchema);

export default Terms;
