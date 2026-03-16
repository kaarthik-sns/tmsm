import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Define the TypeScript interface
export interface ICity extends Document {
  id: number;
  name: string;
  state_id: number;
  state_code: string;
  state_name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  latitude: string;
  longitude: string;
  wikiDataId?: string;
}

// Define the schema with types
const CitiesSchema = new Schema<ICity>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  state_id: { type: Number, required: true },
  state_code: { type: String, required: true },
  state_name: { type: String, required: true },
  country_id: { type: Number, required: true },
  country_code: { type: String, required: true },
  country_name: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  wikiDataId: { type: String, required: false },
}, {
  collection: "cities",
});

// Create the model with interface
const Cities: Model<ICity> = models.Cities || model<ICity>("Cities", CitiesSchema);

export default Cities;
