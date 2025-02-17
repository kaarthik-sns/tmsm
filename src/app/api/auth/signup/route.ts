import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectToDatabase from '@/lib/mongodb';
import { sendEmail } from "@/utils/mail.util"
import { verificationTemplate } from '@/lib/template/verification';
import { welcomeTemplate } from '@/lib/template/welcome';
import { adminWelcomeTemplate } from '@/lib/template/welcome-admin';
import getSMTPSettings from '@/utils/settings.util';


export async function POST(request: Request) {
    const { profile_created_for, profile_creator_name, name, lastname, email, password, confirmPassword, phonenumber, religion, } = await request.json();

    const testData = [];

    let copyright = '';
    let contactMail = '';

    const smtpSettings = await getSMTPSettings();
    if (smtpSettings) {
        copyright = `© ${new Date().getFullYear()} ${smtpSettings.copyright}`;
        contactMail = smtpSettings.organisation_email_id;
    }


    const email_id = email?.replace(/\s+/g, "").toLowerCase() || "";

    const isValidEmail = (email_id: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email_id);
    }

    if (!name || !email_id || !password || !confirmPassword) {
        return NextResponse.json({ message: " All fields are required" }, { status: 400 })
    }
    if (!isValidEmail(email_id)) {
        return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }
    if (confirmPassword !== password) {
        return NextResponse.json({ message: "Password does not match" }, { status: 400 })
    }
    if (password.length < 6) {
        return NextResponse.json({ message: "Password must be at least 6 character long" }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const existingUser = await User.findOne({ email, is_active: true });
        if (existingUser) {
            return NextResponse.json({ message: "User already exist" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            profile_created_for,
            profile_creator_name,
            email: email_id,
            name,
            lastname,
            phonenumber,
            religion,
            password: hashedPassword,
            created_at: new Date()
        });

        await newUser.save();

        const verificationLink = `${process.env.BASE_URL}/verify-email?code=${newUser.email_code}`;

        const receipients = [{
            name: name,
            address: email
        }]

        const htmlBody = welcomeTemplate(name, copyright);

        const result = await sendEmail({
            receipients,
            subject: `Welcome to TMSM, ${name}!`,
            message: htmlBody
        })

        const htmlBody2 = verificationTemplate(name, verificationLink, copyright, contactMail);

        const result2 = await sendEmail({
            receipients,
            subject: 'Verify Your TMSM Account',
            message: htmlBody2
        })

        const htmlBody3 = adminWelcomeTemplate(email, name, phonenumber, copyright);

        const receipients2 = [{
            name: 'admin',
            address: ''
        }]

        const result3 = await sendEmail({
            receipients: receipients2,
            subject: 'New Member Joined TMSM',
            message: htmlBody3
        })

        return NextResponse.json({ message: "Registration successful. Await admin approval. Check your email for updates." }, { status: 201 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}