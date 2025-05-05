import mongoose, { Schema, model, models } from "mongoose";

const AboutUs = new Schema({
  banner_title: { type: String, required: false },
  banner_img: { type: String, required: false },

  sec_one_title: { type: String, required: false },
  sec_one_img: { type: String, required: false },
  sec_one_desc: { type: String, required: false, text: true },

  sec_two_title: { type: String, required: false },
  sec_two_desc: { type: String, required: false, text: true },
  sec_two_img: { type: String, required: false },

  feature_one: { type: String, required: false },
  feature_one_desc: { type: String, required: false },
  feature_one_img: { type: String, required: false },

  feature_two: { type: String, required: false },
  feature_two_desc: { type: String, required: false },
  feature_two_img: { type: String, required: false },

  feature_three: { type: String, required: false },
  feature_three_desc: { type: String, required: false },
  feature_three_img: { type: String, required: false },

  feature_four: { type: String, required: false },
  feature_four_desc: { type: String, required: false },
  feature_four_img: { type: String, required: false },

  sec_one_title_ta: { type: String, required: false },
  sec_one_desc_ta: { type: String, required: false },
  sec_two_title_ta: { type: String, required: false },
  sec_two_desc_ta: { type: String, required: false },
  feature_one_ta: { type: String, required: false },
  feature_one_desc_ta: { type: String, required: false },

  feature_two_ta: { type: String, required: false },
  feature_two_desc_ta: { type: String, required: false },

  feature_three_ta: { type: String, required: false },
  feature_three_desc_ta: { type: String, required: false },

  feature_four_ta: { type: String, required: false },
  feature_four_desc_ta: { type: String, required: false },

  banner_title_ta: { type: String, required: false },

  updated_at: { type: Date, default: Date.now },
}, { collection: "about_us" });

const About = models.about_us || model("about_us", AboutUs);

export default About;