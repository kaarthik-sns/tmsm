import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Define the TypeScript interface for a document
export interface IContactUs extends Document {
    name?: string;
    email?: string;
    interested_in?: string;
    phone?: string;
    message?: string;
    is_delete?: boolean;
    created_at?: Date;
    updated_at?: Date;
    mail_status?: boolean;
}

// Define the schema with the interface
const ContactUsSchema = new Schema<IContactUs>({
    name: { type: String, required: false },
    email: { type: String, required: false },
    interested_in: { type: String, required: false },
    phone: { type: String, required: false },
    message: { type: String, required: false },
    is_delete: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    mail_status: { type: Boolean, default: false },
}, {
    collection: "contact_us",
});

// Create the model with typing
const Contact: Model<IContactUs> = models.contact_us || model<IContactUs>("contact_us", ContactUsSchema);

export default Contact;
