import mongoose, { Schema, model, models } from "mongoose";

const HomePage = new Schema({
  sec_one_title: { type: String, required: true },
  sec_one_desc: { type: String, required: false, text: true },
  sec_one_img: { type: String, required: true },

  sec_two_title: { type: String, required: true },
  sec_two_desc: { type: String, required: false, text: true },
  sec_two_img: { type: String, required: true },

  feature_one: { type: String, required: true },
  feature_one_img: { type: String, required: true },
  feature_two: { type: String, required: true },
  feature_two_img: { type: String, required: true },
  feature_three: { type: String, required: true },
  feature_three_img: { type: String, required: true },
  feature_four: { type: String, required: true },
  feature_four_img: { type: String, required: true },

  banner_title: { type: String, required: true },
  banner_btn_text: { type: String, required: true },
  banner_btn_link: { type: String, required: true },

  updated_at: { type: Date, default: Date.now },
}, { collection: "home_page" });

// Get Slider by title
HomePage.statics.getByTitle = function (title: string) {
  return this.findOne({ title });
};


const Slider = models.home_page || model("home_page", HomePage);

export default Slider;