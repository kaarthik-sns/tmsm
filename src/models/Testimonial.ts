import mongoose, { Schema, model, models } from "mongoose";

const TestimonialSchema = new Schema({
  name: { type: String, required: true }, // name as text for full-text search
  description: { type: String, required: false, text: true }, // description as text
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false }, // admin approved or not status
  image: { type: String, required: true }, // name as text for full-text search
});


// Get Testimonial by id
TestimonialSchema.statics.getById = function (id: string) {
  return this.findOne({ _id: id });
}


const Testimonial = models.testimonial || model("testimonial", TestimonialSchema);

export default Testimonial;