import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema({
  name: { type: String, required: true }, // name as text for full-text search
  description: { type: String, required: false, text: true }, // description as text
  rating: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false }, // admin approved or not status
});

const review = models.review || model("review", ReviewSchema);

export default review;