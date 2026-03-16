import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Document interface
export interface IFaq extends Document {
  title?: string;
  description?: string;
  title_ta?: string;
  description_ta?: string;
  created_at?: Date;
  updated_at?: Date;
  is_delete?: boolean;
}

// Model interface for statics
interface IFaqModel extends Model<IFaq> {
  getByTitle(title: string): Promise<IFaq | null>;
}

// Schema definition
const FaqSchema = new Schema<IFaq>({
  title: { type: String, required: false },
  description: { type: String, required: false, text: true },
  title_ta: { type: String, required: false },
  description_ta: { type: String, required: false, text: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false },
}, {
  collection: "faqs",
});

// Static method definition
FaqSchema.statics.getByTitle = function (title: string) {
  return this.findOne({ title });
};

// Model creation with static typing
const Faq: IFaqModel = (models.faqs as IFaqModel) || model<IFaq, IFaqModel>("faqs", FaqSchema);

export default Faq;
