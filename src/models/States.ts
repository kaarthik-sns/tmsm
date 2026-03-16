import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// TypeScript interface for the State document
export interface IState extends Document {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  state_code: string;
  type?: string;
  latitude: string;
  longitude: string;
}

// Define the schema
const StateSchema = new Schema<IState>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  country_id: { type: Number, required: true },
  country_code: { type: String, required: true },
  country_name: { type: String, required: true },
  state_code: { type: String, required: true },
  type: { type: String }, // Optional
  latitude: { type: String, required: true },
  longitude: { type: String, required: true }
}, {
  collection: "states",
});

// Create and export the model
const States: Model<IState> = models.States || model<IState>("States", StateSchema);

export default States;