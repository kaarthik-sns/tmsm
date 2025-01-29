import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectToDatabase from '@/lib/mongodb';
import { sendEmail } from "@/utils/mail.util"
import { changePasswordTemplate } from '@/lib/template/change-password';
import Admin from '@/models/Admin';
import getSMTPSettings from '@/utils/settings.util';


export async function POST(request: Request) {
    const { email, is_admin } = await request.json();

    let copyright = '';
    const smtpSettings = await getSMTPSettings();
    if (smtpSettings) {
        copyright = `© ${new Date().getFullYear()} ${smtpSettings.copyright}`;
    }

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
        let forgotPasswordLink = '';

        if (is_admin) {
            forgotPasswordLink = `${process.env.BASE_URL}/admin/change-password?id=${userId}&is_admin=${is_admin}`;
        } else {
            forgotPasswordLink = `${process.env.BASE_URL}/frontend/change-password?id=${userId}&is_admin=${is_admin}`;
        }

        const receipients = [{
            name: name,
            address: email
        }]

        const htmlBody = changePasswordTemplate(forgotPasswordLink, copyright);

        const result = await sendEmail({
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