
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
    receipients: Mail.Address[],
    subject: string;
    message: string;
}

export const sendEmail = async (dto: SendEmailDto) => {
    const { receipients, subject, message } = dto;

    // Filter out recipients without email addresses
    const validReceipients = receipients.filter(r => r.address && r.address.trim() !== "");

    if (validReceipients.length === 0 && receipients[0]?.name !== 'admin') {
        console.log("No valid recipients with email addresses found. Skipping email sending.");
        return;
    }

    // Fetch SMTP settings from the database
    const smtpSettings = await getSMTPSettings();

    let receipientsData = receipients;

    if (receipients[0].name == 'admin') {
        receipientsData = [{
            name: smtpSettings.organisation_name,
            address: smtpSettings.admin_to_email_id
        }]
    }

    const sender = {
        name: smtpSettings.organisation_name,
        address: smtpSettings.organisation_email_id
    }

    const transport = nodemailer.createTransport({
        host: smtpSettings.smtp_host,
        port: smtpSettings.smtp_port,
        secure: smtpSettings.smtp_secure,
        auth: {
            user: smtpSettings.smtp_mail,
            pass: smtpSettings.smtp_password
        },
        dkim: {
            domainName: 'tmsmsaivamudaliyarmatrimony.com',
            keySelector: 'default',
            privateKey: process.env.DKIM_PRIVATE_KEY
        },
        logger: true,
        debug: true
    } as SMTPTransport.Options)

    const baseUrl = process.env.BASE_URL;
    const logoUrl = `${baseUrl}/images/logo/mail-logo.png`;
    const finalMessage = message.replace(/cid:mail_logo/g, logoUrl);

    return await transport.sendMail({
        from: sender,
        to: receipientsData,
        subject,
        html: finalMessage,
        text: message
    });
}