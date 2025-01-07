import mongoose, { Schema, model, models } from "mongoose";

const SettingsSchema = new Schema({
  logo: { type: String, required: false },
  favicon: { type: String, required: false },
  profile_req_limit: { type: String, required: false },
  organisation_description: { type: String, required: false },
  organisation_name: { type: String, required: false },
  organisation_email_id: { type: String, required: false },
  admin_to_email_id: { type: String, required: false },
  admin_from_email_id: { type: String, required: false },
  phone_no: { type: String, required: false },
  address: { type: String, required: false },
  domain_url: { type: String, required: false },
  copyright: { type: String, required: false },

  facebook: { type: String, required: false },
  twitter: { type: String, required: false },
  instagram: { type: String, required: false },
  youtube: { type: String, required: false },

  smtp_mail: { type: String, required: false },
  smtp_password: { type: String, required: false },
  smtp_port: { type: String, required: false },
  smtp_host: { type: String, required: false },
  smtp_secure: { type: Boolean, default: true, required: false },

  updated_at: { type: Date, default: Date.now }
}, { collection: "settings" });


const Settings = models.Settings || model("Settings", SettingsSchema);

export default Settings;



