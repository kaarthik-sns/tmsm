import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  is_active: { type: Boolean, default: true },
  is_verify: { type: Boolean, default: false },
  is_approve: { type: Boolean, default: false },
  email_code: {
    type: String,
    default: function () {
      return `${Math.floor(Math.random() * 1000000)}`; // Generates a random number with "tmsm" prefix
    }
  },
  created_at: { type: Date, required: false },
  updated_at: { type: Date, default: Date.now },

});

// Get user by name
UserSchema.statics.getByName = function (name: string) {
  return this.findOne({ name });
};

// Get user by id
UserSchema.statics.getById = function (id: string) {
  return this.findOne({ _id: id });
}

// Get user by email
UserSchema.statics.getByEmail = function (email: string) {
  return this.findOne({ email });
};

// Get user by email code
UserSchema.statics.getByEmailCode = function (email_code: string) {
  return this.findOne({ email_code });
};

// Get only verified users
UserSchema.statics.getOnlyVerified = function () {
  return this.find({ is_verify: true });
};

// Get only active users
UserSchema.statics.getOnlyActive = function () {
  return this.find({ is_active: true });
};

// Get only valid users
UserSchema.statics.getOnlyValid = function () {
  return this.find({ is_verify: true, is_active: true, is_approve: true });
};


const User = models.User || model("User", UserSchema);

export default User;