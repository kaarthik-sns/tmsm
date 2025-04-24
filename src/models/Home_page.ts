import mongoose, { Schema, model, models } from "mongoose";

const HomePage = new Schema({
  sec_one_title: { type: String, required: false },
  sec_one_desc: { type: String, required: false, text: true },
  sec_one_img: { type: String, required: false },

  sec_two_title: { type: String, required: false },
  sec_two_desc: { type: String, required: false, text: true },
  sec_two_img: { type: String, required: false },

  feature_one: { type: String, required: false },
  feature_one_img: { type: String, required: false },
  feature_two: { type: String, required: false },
  feature_two_img: { type: String, required: false },
  feature_three: { type: String, required: false },
  feature_three_img: { type: String, required: false },
  feature_four: { type: String, required: false },
  feature_four_img: { type: String, required: false },

  banner_title: { type: String, required: false },
  banner_btn_text: { type: String, required: false },
  banner_btn_link: { type: String, required: false },

  sec_one_title_ta: { type: String, required: false },
  sec_one_desc_ta: { type: String, required: false },
  sec_two_title_ta: { type: String, required: false },
  sec_two_desc_ta: { type: String, required: false },
  feature_one_ta: { type: String, required: false },
  feature_two_ta: { type: String, required: false },
  feature_three_ta: { type: String, required: false },
  feature_four_ta: { type: String, required: false },
  banner_title_ta: { type: String, required: false },
  banner_btn_text_ta: { type: String, required: false },

  updated_at: { type: Date, default: Date.now },
}, { collection: "home_page" });

// Get Slider by title
HomePage.statics.getByTitle = function (title: string) {
  return this.findOne({ title });
};


const Home = models.home_page || model("home_page", HomePage);

export default Home;
