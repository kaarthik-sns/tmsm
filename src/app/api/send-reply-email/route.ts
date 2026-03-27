import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from "@/utils/mail.util";
import getSMTPSettings from '@/utils/settings.util';
import { sendReply } from '@/lib/template/send-reply';
import { sendReplyTa } from '@/lib/template/send-reply-ta';
import ContactUsTemplate from '@/models/Contact_us_template';
import Contact from '@/models/Contact'; // Adjust this path based on your project structure

export async function POST(req: NextRequest) {
    try {
        const { _id, name, email, phone, language, reply_message } = await req.json();

        const smtpSettings = await getSMTPSettings();

        const contactMail = smtpSettings?.organisation_email_id || '';
        const copyright = `© ${new Date().getFullYear()} ${smtpSettings?.copyright || ''}`;

        let model = await ContactUsTemplate.findOne();

        const message = reply_message;

        if (email) {
            const htmlBody = language === 'ta' ? sendReplyTa(name, message, copyright) : sendReply(name, message, copyright);

            const receipients = [{ name: name || 'User', address: email }];

            await sendEmail({
                receipients,
                subject: 'Your Inquiry Received - Thank you!',
                message: htmlBody
            });
        }

        await Contact.findByIdAndUpdate(_id, { mail_status: true, reply_message: message });

        return NextResponse.json({ success: true, message: 'Reply email sent successfully' });
    } catch (error) {
        console.error("Error sending reply:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to send reply', error: error.message },
            { status: 500 }
        );
    }
}