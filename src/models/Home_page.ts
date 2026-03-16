import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// TypeScript interface for the HomePage document
export interface IHomePage extends Document {
  sec_one_title?: string;
  sec_one_desc?: string;
  sec_one_img?: string;

  sec_two_title?: string;
  sec_two_desc?: string;
  sec_two_img?: string;

  feature_one?: string;
  feature_one_img?: string;
  feature_two?: string;
  feature_two_img?: string;
  feature_three?: string;
  feature_three_img?: string;
  feature_four?: string;
  feature_four_img?: string;

  banner_title?: string;
  banner_btn_text?: string;
  banner_btn_link?: string;

  sec_one_title_ta?: string;
  sec_one_desc_ta?: string;
  sec_two_title_ta?: string;
  sec_two_desc_ta?: string;
  feature_one_ta?: string;
  feature_two_ta?: string;
  feature_three_ta?: string;
  feature_four_ta?: string;
  banner_title_ta?: string;
  banner_btn_text_ta?: string;

  updated_at?: Date;
}

// Schema definition with types
const HomePageSchema = new Schema<IHomePage>({
  sec_one_title: { type: String },
  sec_one_desc: { type: String, text: true },
  sec_one_img: { type: String },

  sec_two_title: { type: String },
  sec_two_desc: { type: String, text: true },
  sec_two_img: { type: String },

  feature_one: { type: String },
  feature_one_img: { type: String },
  feature_two: { type: String },
  feature_two_img: { type: String },
  feature_three: { type: String },
  feature_three_img: { type: String },
  feature_four: { type: String },
  feature_four_img: { type: String },

  banner_title: { type: String },
  banner_btn_text: { type: String },
  banner_btn_link: { type: String },

  sec_one_title_ta: { type: String },
  sec_one_desc_ta: { type: String },
  sec_two_title_ta: { type: String },
  sec_two_desc_ta: { type: String },
  feature_one_ta: { type: String },
  feature_two_ta: { type: String },
  feature_three_ta: { type: String },
  feature_four_ta: { type: String },
  banner_title_ta: { type: String },
  banner_btn_text_ta: { type: String },

  updated_at: { type: Date, default: Date.now },
}, {
  collection: "home_page",
});

// Export the model with interface
const Home: Model<IHomePage> = models.home_page || model<IHomePage>("home_page", HomePageSchema);

export default Home;
