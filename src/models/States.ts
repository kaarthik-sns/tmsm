import mongoose, { Schema, model, models } from "mongoose";

const StateSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  country_id: { type: Number, required: true }, // Changed to Number as it's an ID
  country_code: { type: String, required: true },
  country_name: { type: String, required: true },
  state_code: { type: String, required: true },
  type: { type: String }, // Optional field
  latitude: { type: String, required: true },
  longitude: { type: String, required: true }
});

const States = models.States || model("States", StateSchema);

export default States;
