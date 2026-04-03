import mongoose, {
  Schema,
  model,
  models,
  Document,
  Model,
} from "mongoose";

interface IUser {
  name: string;
  lastname?: string;
  email: string;
  password?: string;
  phonenumber?: string;
  is_active?: boolean;
  is_verify?: boolean;
  is_approve?: boolean;
  is_delete?: boolean;
  email_code?: string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  marital_status?: string;
  religion?: string;
  caste?: string;
  subcaste?: string;
  age?: number;
  birthdate?: Date;
  state_id?: string;
  city_id?: string;
  country_id?: string;
  place_of_birth?: string;
  education?: string;
  complexion?: string;
  profession?: string;
  income?: string;
  job?: string;
  place_of_work?: string;
  kuladeivam?: string;
  place_of_kuladeivam_temple?: string;
  gothram?: string;
  profile_photo?: string;
  horoscope?: string;
  reference1?: string;
  reference2?: string;
  father_name?: string;
  father_phonenumber?: string;
  father_occupation?: string;
  father_religion?: string;
  father_profession?: string;
  father_placeOfWork?: string;
  mother_name?: string;
  mother_phonenumber?: string;
  mother_occupation?: string;
  mother_religion?: string;
  mother_profession?: string;
  mother_placeOfWork?: string;
  address?: string;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  photo4?: string;
  partner_pref_education?: string;
  partner_pref_age?: number;
  partner_pref_caste?: string;
  partner_pref_subcaste?: string;
  profile_creator_photo?: string;
  maritalstatus?: string;
  profile_created_for?: string;
  profile_creator_aadhar?: string;
  profile_creator_name?: string;
  profile_creator_phonenumber?: string;
  lookingfor?: string;
  bride_groom_detail?: string;
  gender?: string;
  deactivate_reason?: string;
  reactivate_reason?: string;
  relation_name?: string;
}


interface IUserDocument extends IUser, Document { }

interface IUserModel extends Model<IUserDocument> { }

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    lastname: { type: String },
    email: { type: String, required: false },
    password: { type: String },
    phonenumber: { type: String, required: true, unique: true },
    is_active: { type: Boolean, default: true },
    is_verify: { type: Boolean, default: false },
    is_approve: { type: Boolean, default: false },
    is_delete: { type: Boolean, default: false },
    email_code: {
      type: String,
      default: () => `${Math.floor(Math.random() * 1000000)}`,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: { type: String },
    updated_by: { type: String },
    marital_status: { type: String },
    religion: { type: String },
    caste: { type: String },
    subcaste: { type: String },
    age: { type: Number },
    birthdate: { type: Date },
    state_id: { type: String },
    city_id: { type: String },
    country_id: { type: String },
    place_of_birth: { type: String },
    education: { type: String },
    complexion: { type: String },
    profession: { type: String },
    income: { type: String },
    job: { type: String },
    place_of_work: { type: String },
    kuladeivam: { type: String },
    place_of_kuladeivam_temple: { type: String },
    gothram: { type: String },
    profile_photo: { type: String },
    horoscope: { type: String },
    reference1: { type: String },
    reference2: { type: String },
    father_name: { type: String },
    father_phonenumber: { type: String },
    father_occupation: { type: String },
    father_religion: { type: String },
    father_profession: { type: String },
    father_placeOfWork: { type: String },
    mother_name: { type: String },
    mother_phonenumber: { type: String },
    mother_occupation: { type: String },
    mother_religion: { type: String },
    mother_profession: { type: String },
    mother_placeOfWork: { type: String },
    address: { type: String },
    photo1: { type: String },
    photo2: { type: String },
    photo3: { type: String },
    photo4: { type: String },
    partner_pref_education: { type: String },
    partner_pref_age: { type: Number },
    partner_pref_caste: { type: String },
    partner_pref_subcaste: { type: String },
    profile_creator_photo: { type: String },
    maritalstatus: { type: String },
    profile_created_for: { type: String },
    profile_creator_aadhar: { type: String },
    profile_creator_name: { type: String },
    profile_creator_phonenumber: { type: String },
    lookingfor: { type: String },
    bride_groom_detail: { type: String },
    gender: { type: String },
    deactivate_reason: { type: String },
    reactivate_reason: { type: String },
    relation_name: { type: String },
  },
  {
    collection: "users",
  }
);


const User =
  (models.User as IUserModel) || model<IUserDocument, IUserModel>("User", UserSchema);

export default User;