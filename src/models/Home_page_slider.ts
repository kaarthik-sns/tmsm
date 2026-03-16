import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Interface for the Slider document
export interface ISlider extends Document {
  title: string;
  description?: string;
  title_ta: string;
  description_ta?: string;
  updated_at?: Date;
  is_delete?: boolean;
  image: string;
}

// Interface for the model with static methods
interface ISliderModel extends Model<ISlider> {
  getByTitle(title: string): Promise<ISlider | null>;
}

// Schema definition
const SliderSchema = new Schema<ISlider>({
  title: { type: String, required: true },
  description: { type: String, required: false, text: true },
  title_ta: { type: String, required: true },
  description_ta: { type: String, required: false, text: true },
  updated_at: { type: Date, default: Date.now },
  is_delete: { type: Boolean, default: false },
  image: { type: String, required: true },
}, {
  collection: "home_page_sliders",
});

// Static method
SliderSchema.statics.getByTitle = function (title: string) {
  return this.findOne({ title });
};

// Model export with type casting
const Slider: ISliderModel = (models.home_page_slider as ISliderModel) || model<ISlider, ISliderModel>("home_page_slider", SliderSchema);

export default Slider;
