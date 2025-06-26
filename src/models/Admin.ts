import mongoose, { Schema, Document, Model, model, models } from 'mongoose';

interface IAdmin extends Document {
  name: string;
  email: string;
  password?: string;
  email_code?: string;
  image?: string;
  updated_at: Date;
}

const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  email_code: { type: String },
  image: { type: String },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'admin_users' });

const Admin: Model<IAdmin> = models.Admin || model<IAdmin>('Admin', AdminSchema);
export default Admin;
