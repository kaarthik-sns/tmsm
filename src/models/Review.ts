import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// TypeScript interface for the Review document
export interface IReview extends Document {
  name?: string;
  description?: string;
  name_ta?: string;
  description_ta?: string;
  rating: string;
  updated_at?: Date;
  is_delete?: boolean;
}

// Define the schema with proper typing
const ReviewSchema = new Schema<IReview>({
  name: { type: String },
  description: { type: String, text: true },
  name_ta: { type: String },
  description_ta: { type: String, text: true },
  rating: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false },
}, {
  collection: "reviews",
});

// Create and export the model
const Review: Model<IReview> = models.review || model<IReview>("review", ReviewSchema);

export default Review;
