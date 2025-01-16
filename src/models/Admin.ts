import mongoose, { Schema, model, models } from "mongoose";

const AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
  updated_at: { type: Date, default: Date.now }
}, { collection: "admin_users" });

// Get Admin by name
AdminSchema.statics.getByName = function (name: string) {
  return this.findOne({ name });
};

// Get Admin by email
AdminSchema.statics.getByEmail = function (email: string) {
  return this.findOne({ email });
};

// Get Admin by email code
AdminSchema.statics.getByEmailCode = function (email_code: string) {
  return this.findOne({ email_code });
};


const Admin = models.Admin || model("Admin", AdminSchema);

export default Admin;