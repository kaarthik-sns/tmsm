import mongoose, { Schema, model, models } from "mongoose";

const ContactUs = new Schema({
    name: { type: String, required: false },
    email: { type: String, required: false },
    interested_in: { type: String, required: false },
    phone: { type: String, required: false },
    message: { type: String, required: false },
    is_delete: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
}, { collection: "contact_us" });

const Contact = models.contact_us || model("contact_us", ContactUs);

export default Contact;