import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// TypeScript interface for the testimonial document
export interface ITestimonial extends Document {
  name?: string;
  description?: string;
  name_ta?: string;
  description_ta?: string;
  updated_at?: Date;
  is_delete?: boolean;
  image: string;
}

// Schema definition
const TestimonialSchema = new Schema<ITestimonial>({
  name: { type: String },
  description: { type: String, text: true },
  name_ta: { type: String },
  description_ta: { type: String, text: true },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false },
  image: { type: String, required: true },
}, {
  collection: "testimonials",
});

// Create and export model
const Testimonial: Model<ITestimonial> =
  models.testimonial || model<ITestimonial>("testimonial", TestimonialSchema);

export default Testimonial;
