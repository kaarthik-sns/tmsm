import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectToDatabase from '@/lib/mongodb';
import { sendEmail } from "@/utils/mail.util"
import * as Handlebars from 'handlebars';
import { changePassword } from '@/lib/template/change-password';
import Admin from '@/models/Admin';

export async function POST(request: Request) {
    const { email, is_admin } = await request.json();

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    if (!email) {
        return NextResponse.json({ message: " Email is required" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
        return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    try {
        await connectToDatabase();

        var existingUser = await User.findOne({ email, is_active: true });

        if (is_admin) {
            existingUser = await Admin.findOne({ email });
        }

        if (!existingUser) {
            // Return a 404 response if the user is not found
            return NextResponse.json({ message: "Check your email id" }, { status: 404 });
        }

        const userId = existingUser._id; // Access the _id field
        const name = existingUser.name; // Access the _id field

        const forgotPasswordLink = `${process.env.BASE_URL}/change-password?id=${userId}&is_admin=${is_admin}`;

        const sender = {
            name: 'TMSM',
            address: 'no-reply@tmsm.com'
        }

        const receipients = [{
            name: name,
            address: email
        }]

        const template = Handlebars.compile(changePassword);
        const htmlBody = template({
            forgotPasswordLink: forgotPasswordLink,
        });

        const result = await sendEmail({
            sender,
            receipients,
            subject: 'TMSM - Forgot Password!',
            message: htmlBody
        })

        console.log("Email sent successfully:", result);
        return NextResponse.json({ message: "Password reset email has been sent successfully" }, { status: 201 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}