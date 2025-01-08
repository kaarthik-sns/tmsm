import mongoose, { Schema, model, models } from "mongoose";

const SliderSchema = new Schema({
  title: { type: String, required: true }, // name as text for full-text search
  description: { type: String, required: false, text: true }, // description as text
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false }, // admin approved or not status
  image: { type: String, required: true }, // name as text for full-text search
});

// Get Slider by title
SliderSchema.statics.getByTitle = function (title: string) {
  return this.findOne({ title });
};

// Get Slider by id
SliderSchema.statics.getById = function (id: string) {
  return this.findOne({ _id: id });
}


const Slider = models.home_page_slider || model("home_page_slider", SliderSchema);

export default Slider;