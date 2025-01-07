
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import connectToDatabase from '@/lib/mongodb';
import Settings from '@/models/Settings';

async function getSMTPSettings() {
    try {
        await connectToDatabase();
        const settings = await Settings.findOne({});
        if (!settings) {
            throw new Error('SMTP settings not found in the database.');
        }
        return settings;
    } catch (error) {
        console.error('Error fetching SMTP settings:', error);
        throw new Error('Unable to fetch SMTP settings from the database.');
    }
}

type SendEmailDto = {
    sender: Mail.Address,
    receipients: Mail.Address[],
    subject: string;
    message: string;
}

export const sendEmail = async (dto: SendEmailDto) => {
    const { sender, receipients, subject, message } = dto;

    // Fetch SMTP settings from the database
    const smtpSettings = await getSMTPSettings();

    console.log(smtpSettings);

    const transport = nodemailer.createTransport({
        host: smtpSettings.smtp_host,
        port: smtpSettings.smtp_port,
        secure: smtpSettings.smtp_secure,
        auth: {
            user: smtpSettings.smtp_mail,
            pass: smtpSettings.smtp_password
        },
        logger: true,
        debug: true
    } as SMTPTransport.Options)

    return await transport.sendMail({
        from: sender,
        to: receipients,
        subject,
        html: message,
        text: message
    }, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}
