import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectToDatabase from '@/lib/mongodb';
import { sendEmail } from "@/utils/mail.util"
import { changePasswordTemplate } from '@/lib/template/change-password';
import Admin from '@/models/Admin';
import getSMTPSettings from '@/utils/settings.util';
import crypto from "crypto";
import { hash } from "bcryptjs";


export async function POST(request: Request) {
    const { email, is_admin } = await request.json();

    let copyright = '';
    const smtpSettings = await getSMTPSettings();
    if (smtpSettings) {
        copyright = `© ${new Date().getFullYear()} ${smtpSettings.copyright}`;
    }



    if (!email) {
        return NextResponse.json({ message: " Email cannot be empty" }, { status: 400 })
    }



    try {
        await connectToDatabase();

        // Generate a secure token
        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = await hash(token, 10);

        var existingUser = await User.findOne({ email, is_active: true });

        if (is_admin) {
            existingUser = await Admin.findOne({ email });
        }
        if (existingUser !== null && existingUser !== undefined) {
            existingUser.email_code = hashedToken;
            await existingUser.save();
        }

        
        if (!existingUser) {
            // Return a 404 response if the user is not found
            return NextResponse.json({ message: "Please provide a valid email address" }, { status: 404 });
        }
        const userId = existingUser._id; // Access the _id field
        const name = existingUser.name; // Access the _id field
        let forgotPasswordLink = '';

        if (is_admin) {
            forgotPasswordLink = `${process.env.BASE_URL}/admin/change-password?token=${hashedToken}&is_admin=${is_admin}`;
        } else {
            forgotPasswordLink = `${process.env.BASE_URL}/change-password?token=${hashedToken}`;
        }

        const receipients = [{
            name: name,
            address: email
        }]

        const htmlBody = changePasswordTemplate(forgotPasswordLink, copyright);

        const result = await sendEmail({
            receipients,
            subject: 'TMSM - Forgot Password',
            message: htmlBody
        })

        return NextResponse.json({ message: "Password reset email has been sent successfully" }, { status: 201 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}