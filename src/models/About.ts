import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Define the TypeScript interface
export interface IAboutUs extends Document {
  banner_title?: string;
  banner_img?: string;

  sec_one_title?: string;
  sec_one_img?: string;
  sec_one_desc?: string;

  sec_two_title?: string;
  sec_two_desc?: string;
  sec_two_img?: string;

  feature_one?: string;
  feature_one_desc?: string;
  feature_one_img?: string;

  feature_two?: string;
  feature_two_desc?: string;
  feature_two_img?: string;

  feature_three?: string;
  feature_three_desc?: string;
  feature_three_img?: string;

  feature_four?: string;
  feature_four_desc?: string;
  feature_four_img?: string;

  sec_one_title_ta?: string;
  sec_one_desc_ta?: string;
  sec_two_title_ta?: string;
  sec_two_desc_ta?: string;

  feature_one_ta?: string;
  feature_one_desc_ta?: string;

  feature_two_ta?: string;
  feature_two_desc_ta?: string;

  feature_three_ta?: string;
  feature_three_desc_ta?: string;

  feature_four_ta?: string;
  feature_four_desc_ta?: string;

  banner_title_ta?: string;

  updated_at?: Date;
}

// Create the schema
const AboutUsSchema = new Schema<IAboutUs>({
  banner_title: String,
  banner_img: String,

  sec_one_title: String,
  sec_one_img: String,
  sec_one_desc: { type: String, text: true },

  sec_two_title: String,
  sec_two_desc: { type: String, text: true },
  sec_two_img: String,

  feature_one: String,
  feature_one_desc: String,
  feature_one_img: String,

  feature_two: String,
  feature_two_desc: String,
  feature_two_img: String,

  feature_three: String,
  feature_three_desc: String,
  feature_three_img: String,

  feature_four: String,
  feature_four_desc: String,
  feature_four_img: String,

  sec_one_title_ta: String,
  sec_one_desc_ta: String,
  sec_two_title_ta: String,
  sec_two_desc_ta: String,

  feature_one_ta: String,
  feature_one_desc_ta: String,

  feature_two_ta: String,
  feature_two_desc_ta: String,

  feature_three_ta: String,
  feature_three_desc_ta: String,

  feature_four_ta: String,
  feature_four_desc_ta: String,

  banner_title_ta: String,

  updated_at: { type: Date, default: Date.now },
}, { collection: "about_us" });

// Create the model
const About: Model<IAboutUs> = models.about_us || model<IAboutUs>("about_us", AboutUsSchema);

export default About;