import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  is_active: { type: Boolean, default: true }, // account active or not status
  is_verify: { type: Boolean, default: false }, // email verified or not status
  is_approve: { type: Boolean, default: false }, // admin approved or not status
  is_delete: { type: Boolean, default: false }, // user deleted or not status
  email_code: {
    type: String,
    default: function () {
      return `${Math.floor(Math.random() * 1000000)}`; // Generates a random number for email verificationj
    }
  },
  created_at: { type: Date, required: false },
  updated_at: { type: Date, default: Date.now },

  created_by: { type: String, required: false }, // admin or user
  updated_by: { type: String, required: false }, // admin or user

  profile_created_for: { type: String, required: false },
  marital_status: { type: String, required: false },
  religion: { type: String, required: false },
  caste: { type: String, required: false },
  sub_caste: { type: String, required: false },

  age: { type: Number, required: false },
  date_of_birth: { type: Date, required: false },

  place_of_birth: { type: String, required: false },
  education: { type: String, required: false },
  complexion: { type: String, required: false }, // skin color
  profession: { type: String, required: false },
  income: { type: String, required: false },
  job: { type: String, required: false },
  place_of_work: { type: String, required: false },
  kuladeivam: { type: String, required: false },
  place_of_kuladeivam_temple: { type: String, required: false },
  gothram: { type: String, required: false },
  profile_photo: { type: String, required: false },
  horoscope: { type: String, required: false },

  father_name: { type: String, required: false },
  father_phoneNumber: { type: String, required: false },
  father_occupation: { type: String, required: false },
  father_religion: { type: String, required: false },
  father_profession: { type: String, required: false },
  father_placeOfWork: { type: String, required: false },

  mother_name: { type: String, required: false },
  mother_phoneNumber: { type: String, required: false },
  mother_occupation: { type: String, required: false },
  mother_religion: { type: String, required: false },
  mother_profession: { type: String, required: false },
  mother_placeOfWork: { type: String, required: false },

  address: { type: String, required: false },
  photo1: { type: String, required: false },
  photo2: { type: String, required: false },
  photo3: { type: String, required: false },
  photo4: { type: String, required: false },

  partner_pref_education: { type: String, required: false },
  partner_pref_age: { type: Number, required: false },
  partner_pref_caste: { type: String, required: false },
  partner_pref_subCaste: { type: String, required: false },

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