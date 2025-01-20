import mongoose, { Schema, model, models } from "mongoose";

const AboutUs = new Schema({
  banner_title: { type: String, required: true },
  banner_img: { type: String, required: false},

  sec_one_title : { type: String, required: true },
  sec_one_img: { type: String, required: true },
  sec_one_desc: { type: String, required: false, text: true },

  sec_two_title: { type: String, required: true },
  sec_two_desc: { type: String, required: false, text: true },
  sec_two_img: { type: String, required: true },

  feature_one: { type: String, required: true },
  feature_one_desc: { type: String, required: true },
  feature_one_img: { type: String, required: true },

  feature_two: { type: String, required: true },
  feature_two_desc: { type: String, required: true },
  feature_two_img: { type: String, required: true },

  feature_three: { type: String, required: true },
  feature_three_desc: { type: String, required: true },
  feature_three_img: { type: String, required: true },

  feature_four: { type: String, required: true },
  feature_four_desc: { type: String, required: true },
  feature_four_img: { type: String, required: true },

  updated_at: { type: Date, default: Date.now },
}, { collection: "about_us" });

const About = models.about_us || model("about_us", AboutUs);

export default About;