
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

    // console.log(smtpSettings);

    let receipientsData = receipients;

    if (receipients[0].name == 'admin') {
        receipientsData = [{
            name: 'admin',
            address: 'kaarthikr@searchnscore.com'
        }]

        // receipientsData = [{
        //     name: smtpSettings.organisation_name,
        //     address: smtpSettings.admin_to_email_id
        // }]
    }

    const sender = {
        name: smtpSettings.organisation_name,
        address: smtpSettings.organisation_email_id
    }

    //     _id: new ObjectId('6777c45ba9145b6b99283f1d'),
    //   updated_at: 2025-01-03T11:05:00.000Z,
    //   organisation_name: 'TMSM',
    //   organisation_email_id: 'test@gmail.com',
    //   admin_to_email_id: 'kaarthik@gmail.com',
    //   admin_from_email_id: 'test@gmail.com',
    //   phone_no: '12345678',
    //   address: 'test 123, cbe .',
    //   domain_url: 'tmsm.com',
    //   copyright: 'All rights reserved tmsm.com @2025',
    //   facebook: 'tmsm.com',
    //   twitter: 'tmsm.com',
    //   instagram: 'tmsm.com',
    //   youtube: 'tmsm.com',
    //   smtp_mail: 'searchnscoreinnerdev@gmail.com',
    //   smtp_password: 'xujydlpbydfvzqfu',
    //   smtp_port: '465',
    //   smtp_host: 'smtp.gmail.com',
    //   __v: 0,
    //   logo: '/uploads/admin/1736412673110-4d516b1c108f.jpg',
    //   secure: true,
    //   smtp_secure: true,
    //   organisation_description: '',
    //   profile_req_limit: '5'

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
        to: receipientsData,
        subject,
        html: message,
        text: message
    }, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            // console.log('Email sent:', info.response);
        }
    });
}