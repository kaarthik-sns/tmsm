import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// TypeScript interface for the Settings document
export interface ISettings extends Document {
  logo?: string;
  favicon?: string;
  profile_req_limit?: string;
  organisation_description?: string;
  organisation_name?: string;
  organisation_email_id?: string;
  admin_to_email_id?: string;
  admin_from_email_id?: string;
  phone_no?: string;
  contact_person_name_1?: string;
  phone_no_2?: string;
  contact_person_name_2?: string;
  phone_no_3?: string;
  contact_person_name_3?: string;
  address?: string;
  domain_url?: string;
  copyright?: string;

  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;

  smtp_mail?: string;
  smtp_password?: string;
  smtp_port?: string;
  smtp_host?: string;
  smtp_secure?: boolean;

  contact_desc?: string;
  contact_desc_ta?: string;

  updated_at?: Date;
}

// Mongoose schema definition
const SettingsSchema = new Schema<ISettings>({
  logo: { type: String },
  favicon: { type: String },
  profile_req_limit: { type: String },
  organisation_description: { type: String },
  organisation_name: { type: String },
  organisation_email_id: { type: String },
  admin_to_email_id: { type: String },
  admin_from_email_id: { type: String },
  phone_no: { type: String },
  contact_person_name_1: { type: String },
  phone_no_2: { type: String },
  contact_person_name_2: { type: String },
  phone_no_3: { type: String },
  contact_person_name_3: { type: String },
  address: { type: String },
  domain_url: { type: String },
  copyright: { type: String },

  facebook: { type: String },
  twitter: { type: String },
  instagram: { type: String },
  youtube: { type: String },

  smtp_mail: { type: String },
  smtp_password: { type: String },
  smtp_port: { type: String },
  smtp_host: { type: String },
  smtp_secure: { type: Boolean, default: true },

  contact_desc: { type: String },
  contact_desc_ta: { type: String },

  updated_at: { type: Date, default: Date.now }
}, {
  collection: "settings",
});

// Create and export the model
const Settings: Model<ISettings> =
  models.Settings || model<ISettings>("Settings", SettingsSchema);

export default Settings;