import { NextRequest, NextResponse } from 'next/server';
import Contact from '@/models/Contact'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';
import { contactUsTemplate } from '@/lib/template/contact-us';
import { sendEmail } from "@/utils/mail.util"
import getSMTPSettings from '@/utils/settings.util';


// Handle GET request to list all contacts
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        await connectToDatabase();

        const query: any = {};

        query.is_delete = false;

        // Fetch filtered and paginated users from the database
        const contacts = await Contact.find(query).skip(skip).limit(pageSize);

        // Count total documents for the query
        const totalUsers = await Contact.countDocuments(query);

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: contacts,
            pagination: {
                currentPage: page,
                pageSize,
                totalUsers,
                totalPages: Math.ceil(totalUsers / pageSize),
            },
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Error fetching contacts", error: error.message }, { status: 500 });
    }
}

// Handle POST request to add a new contact
export async function POST(req) {
    try {

        let copyright = '';
        const smtpSettings = await getSMTPSettings();
        if (smtpSettings) {
            copyright = `© ${new Date().getFullYear()} ${smtpSettings.copyright}`;
        }
        
        await connectToDatabase();
        // Parse JSON body data
        const { name, email, interested_in, phone, message } = await req.json();

        // const testData = [];

        // for (let i = 0; i < 30; i++) {
        //     testData.push({
        //         name: `Test User ${i + 1}`,
        //         email: `testuser${i + 1}@gmail.com`,
        //         interested_in: '', // Same hash for simplicity
        //         phone: 1234567890,
        //         message: 'test msg',
        //         created_at: new Date()
        //     });
        // }

        // try {
        //     await Contact.insertMany(testData);
        //     console.log('Test data added successfully');
        // } catch (error) {
        //     console.error('Error adding test data:', error);
        // }

        // Create a new contact document
        const newContact = new Contact({
            name,
            email,
            interested_in,
            phone,
            message,
        });

        const htmlBody = contactUsTemplate(name, email, phone, message, copyright);

        const receipients = [{
            name: 'admin',
            address: ''
        }]

        const result3 = await sendEmail({
            receipients: receipients,
            subject: 'TMSM - New Contact Form Submission',
            message: htmlBody
        })

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
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
        }

        const is_delete = true;
        const updated_at = new Date();

        // Find and update the contact by id
        const updatedContact = await Contact.findByIdAndUpdate(id, { is_delete, updated_at }, { new: true });

        if (!updatedContact) {
            return NextResponse.json({ success: false, message: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Contact status updated", data: updatedContact });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error updating status", error: error.message }, { status: 500 });
    }
}
