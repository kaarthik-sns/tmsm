import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ProfileRequests from '@/models/Profile_requests';
import User from '@/models/User';
import { sendEmail } from "@/utils/mail.util"
import { profileViewRequestTemplate } from '@/lib/template/profile-request';
import getSMTPSettings from '@/utils/settings.util';

export async function POST(request: NextRequest) {

  try {

    let copyright = '';
    let contactMail = '';
    let baseUrl = process.env.BASE_URL || '';  // ✅ Get BASE_URL from .env
    //let mail_logo = `${baseUrl}/images/logo/Flogo.svg`;  // ✅ Construct full path dynamically
    let mail_logo = `https://searchnscore.in/tmsm/images/mail-logo.png?t=${new Date().getTime()}`;


    const smtpSettings = await getSMTPSettings();
    if (smtpSettings) {
      copyright = `© ${new Date().getFullYear()} ${smtpSettings.copyright}`;
      contactMail = smtpSettings.organisation_email_id;

    }

    // Connect to the database
    await connectToDatabase();

    const formData = await request.formData();

    const sender_id = (formData.get('sender_id') as string) ?? '';
    const receiver_id = (formData.get('receiver_id') as string) ?? '';

    // Validate required fields
    if (!sender_id || !receiver_id) {
      return NextResponse.json(
        { message: 'Sender ID and Receiver ID are required' },
        { status: 400 }
      );
    }

    // Create a new notification
    const newNotification = new ProfileRequests({
      sender_id,
      receiver_id,
      status: 'pending' // Default to 'pending' if no status provided
    });

    await newNotification.save();

    const userRecData = await User.findById(receiver_id);
    const email = userRecData.email;
    const recName = userRecData.name;

    const userSentData = await User.findById(sender_id);
    const sentName = userSentData.name;

    const receipients = [{
      name: recName,
      address: email
    }]

    const homePage = process.env.BASE_URL+'/login';

    const htmlBody = profileViewRequestTemplate(recName, sentName, homePage, copyright, mail_logo, contactMail);

    const result = await sendEmail({
      receipients,
      subject: `TMSM - You Have a New Profile View Request from ${sentName}`,
      message: htmlBody
    }); 

    // Return success response
    return NextResponse.json({ message: 'Profile request sent Successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);

    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
