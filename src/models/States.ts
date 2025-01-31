import mongoose, { Schema, model, models } from "mongoose";

const StateSchema = new Schema({
  state_id: { type: String },
  name: { type: String, required: true },
  country_id : { type: String, required: true },
});

const States = models.states || model("states", StateSchema);

export default States;