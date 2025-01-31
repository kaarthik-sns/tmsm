import mongoose, { Schema, model, models } from "mongoose";

const CitiesSchema = new Schema({
  name: { type: String, required: true },
  state_id : { type: String, required: true },
});

const cities = models.cities || model("cities", CitiesSchema);

export default cities;