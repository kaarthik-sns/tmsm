import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';
import { sendEmail } from "@/utils/mail.util";
import { verificationTemplate } from '@/lib/template/verification';
import getSMTPSettings from '@/utils/settings.util';
import crypto from "crypto";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
    const { userId } = await request.json();

    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.is_verify) {
            return NextResponse.json({ message: "User is already verified" }, { status: 400 });
        }

        // Generate a secure token
        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = await hash(token, 10);
        user.email_code = hashedToken;
        await user.save();

        const smtpSettings = await getSMTPSettings();
        const copyright = smtpSettings
            ? `© ${new Date().getFullYear()} ${smtpSettings.copyright}`
            : '';

        const verificationLink = `${process.env.BASE_URL}/frontend/verify-email?code=${user.hashedToken}`;

        const recipients = [{ name: user.name, address: user.email }];

        const emailBody = verificationTemplate(user.name, verificationLink, copyright);

        await sendEmail({
            receipients: recipients,
            subject: 'TMSM - Verification mail',
            message: emailBody
        });

        return NextResponse.json({ message: "Verification email sent successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
