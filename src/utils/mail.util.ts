
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

    // Fetch SMTP settings from the database
    const smtpSettings = await getSMTPSettings();

    let receipientsData = receipients;

    if (receipients[0].name == 'admin') {
        receipientsData = [{
            name: 'admin',
            address: 'kaarthikr@searchnscore.com'
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
        logger: true,
        debug: true
    } as SMTPTransport.Options)

    let baseUrl = process.env.BASE_URL;
    let imagePath = `${baseUrl}/images/logo/mail-logo.png`;

    return await transport.sendMail({
        from: sender,
        to: receipientsData,
        subject,
        html: message,
        attachments: [
            {
                filename: 'mail-logo.png',
                path: imagePath, // Local path to your image
                cid: 'mail_logo' // Content-ID, referenced in the `src` attribute of the image
            }
        ],
        text: message
    }, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            // console.log('Email sent:', info.response);
        }
    });
}