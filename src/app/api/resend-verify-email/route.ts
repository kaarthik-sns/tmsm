import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';
import { sendEmail } from "@/utils/mail.util";
import { verificationTemplate } from '@/lib/template/verification';
import getSMTPSettings from '@/utils/settings.util';

export async function POST(request: Request) {
    const { userId } = await request.json();

    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.is_verify) {
            return NextResponse.json({ message: "User is already verified" }, { status: 400 });
        }

        const smtpSettings = await getSMTPSettings();
        const copyright = smtpSettings
            ? `© ${new Date().getFullYear()} ${smtpSettings.copyright}`
            : '';

        const verificationLink = `${process.env.BASE_URL}/verify-email?code=${user.email_code}`;

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
