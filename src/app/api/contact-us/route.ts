import { NextRequest, NextResponse } from 'next/server';
import Contact from '@/models/Contact'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';


// Handle GET request to list all contacts
export async function GET(req) {
    try {

        await connectToDatabase();

        // Fetch all contacts that are not marked as deleted
        const contacts = await Contact.find({ is_delete: false });

        // Respond with the list of contacts
        return NextResponse.json({ success: true, data: contacts });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error fetching contacts", error: error.message }, { status: 500 });
    }
}

// Handle POST request to add a new contact
export async function POST(req) {
    try {

        await connectToDatabase();
        // Parse JSON body data
        const { name, email, interested_in, phone, message } = await req.json();

        // Create a new contact document
        const newContact = new Contact({
            name,
            email,
            interested_in,
            phone,
            message,
        });

        // Save the new contact document
        await newContact.save();

        // Respond with success
        return NextResponse.json({ success: true, message: "Contact created successfully", data: newContact }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error creating contact", error: error.message }, { status: 500 });
    }
}

// Handle PATCH request to update the contact's status (is_delete)
export async function PATCH(req) {
    try {

        await connectToDatabase();
        // Parse JSON body data
        const { id, is_delete } = await req.json();

        if (!id || typeof is_delete === "undefined") {
            return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
        }

        // Find and update the contact by id
        const updatedContact = await Contact.findByIdAndUpdate(id, { is_delete }, { new: true });

        if (!updatedContact) {
            return NextResponse.json({ success: false, message: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Contact status updated", data: updatedContact });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error updating status", error: error.message }, { status: 500 });
    }
}
