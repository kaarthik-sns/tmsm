import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectToDatabase from '@/lib/mongodb';
import { sendEmail } from "@/utils/mail.util"
import * as Handlebars from 'handlebars';
import { verification } from '@/lib/template/verification';

export async function POST(request: Request) {
    const { name, email, password, confirmPassword } = await request.json();

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    if (!name || !email || !password || !confirmPassword) {
        return NextResponse.json({ message: " All fields are required" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
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
            email,
            name,
            password: hashedPassword,
            created_at: new Date()
        });

        await newUser.save();

        const verificationLink = `${process.env.BASE_URL}/verify-email?code=${newUser.email_code}`;

        const sender = {
            name: 'TMSM',
            address: 'no-reply@tmsm.com'
        }

        const receipients = [{
            name: name,
            address: email
        }]

        const template = Handlebars.compile(verification);
        const htmlBody = template({
            verification_link: verificationLink,
        });

        const result = await sendEmail({
            sender,
            receipients,
            subject: 'TMSM - verification!',
            message: htmlBody
        })


        console.log("Email sent successfully:", result);
        return NextResponse.json({ message: "User created" }, { status: 201 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}