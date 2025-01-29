import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectToDatabase from '@/lib/mongodb';
import { sendEmail } from "@/utils/mail.util"
import { verificationTemplate } from '@/lib/template/verification';
import { welcomeTemplate } from '@/lib/template/welcome';
import { adminWelcomeTemplate } from '@/lib/template/welcome-admin';

export async function POST(request: Request) {
    const { name, lastname, email, password, confirmPassword, phonenumber, religion } = await request.json();

    const testData = [];

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
            lastname,
            phonenumber,
            religion,
            password: hashedPassword,
            created_at: new Date()
        });


        // for (let i = 0; i < 20; i++) {
        //     testData.push({
        //         name: `Test User ${i + 1}`,
        //         email: `testuser${i + 1}@example.com`,
        //         password: hashedPassword, // Same hash for simplicity
        //         is_active: true,
        //         is_verify: true,
        //         is_approve: true,
        //         is_delete:false,
        //         created_at: new Date(),
        //         email_code: '',
        //         updated_at: new Date(),
        //     });
        // }

        // try {
        //     await User.insertMany(testData);
        //     console.log('Test data added successfully');
        // } catch (error) {
        //     console.error('Error adding test data:', error);
        // }


        await newUser.save();

        const verificationLink = `${process.env.BASE_URL}/verify-email?code=${newUser.email_code}`;

        const receipients = [{
            name: name,
            address: email
        }]

        const htmlBody = welcomeTemplate(name);

        const result = await sendEmail({
            receipients,
            subject: 'TMSM - Welcome mail',
            message: htmlBody
        })

        const htmlBody2 = verificationTemplate(name, verificationLink);

        const result2 = await sendEmail({
            receipients,
            subject: 'TMSM - Verification mail',
            message: htmlBody2
        })

        const htmlBody3 = adminWelcomeTemplate(email, name, phonenumber);

        const receipients2 = [{
            name: 'admin',
            address: ''
        }]

        const result3 = await sendEmail({
            receipients: receipients2,
            subject: 'TMSM - New User Registration',
            message: htmlBody3
        })

        return NextResponse.json({ message: "Registration is successful" }, { status: 201 });


    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}