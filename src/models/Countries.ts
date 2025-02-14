import mongoose, { Schema, model, models } from "mongoose";

const CountrySchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  iso3: { type: String, required: true },
  iso2: { type: String, required: true },
  numeric_code: { type: String, required: true },
  phonecode: { type: String, required: true },
  capital: { type: String, required: true },
  currency: { type: String, required: true },
  currency_name: { type: String, required: true },
  currency_symbol: { type: String, required: true },
  tld: { type: String, required: true },
  native: { type: String, required: true },
  region: { type: String, required: true },
  region_id: { type: Number, required: true },
  subregion: { type: String, required: true },
  subregion_id: { type: Number, required: true },
  nationality: { type: String, required: true },
  timezones: [
    {
      zoneName: { type: String, required: true },
      gmtOffset: { type: Number, required: true },
      gmtOffsetName: { type: String, required: true },
      abbreviation: { type: String, required: true },
      tzName: { type: String, required: true },
    },
  ],
  translations: { type: Map, of: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  emoji: { type: String, required: true },
  emojiU: { type: String, required: true },
}, { collection: "countries" });

const Country = models.Country || model("Country", CountrySchema);

export default Country;