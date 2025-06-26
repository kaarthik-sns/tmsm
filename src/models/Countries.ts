import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Define nested timezone interface
interface ITimezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}

// Define Country document interface
export interface ICountry extends Document {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phonecode: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  region_id: number;
  subregion: string;
  subregion_id: number;
  nationality: string;
  timezones: ITimezone[];
  translations: Map<string, string>;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
}

// Create schema
const CountrySchema = new Schema<ICountry>({
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
  translations: {
    type: Map,
    of: String,
    required: true,
  },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  emoji: { type: String, required: true },
  emojiU: { type: String, required: true },
}, {
  collection: "countries",
});

// Export the model
const Country: Model<ICountry> = models.Country || model<ICountry>("Country", CountrySchema);

export default Country;
