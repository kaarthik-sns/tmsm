import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';


export async function POST(req: NextRequest) {

  const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'admin'); // Save in the public directory

  try {
    // Connect to the database
    await connectToDatabase();

    // Ensure the uploads directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Parse the form data
    const formData = await req.formData();

    const logo = formData.get('logo') as File;
    // const favicon = formData.get('favicon') as File;
    const profile_req_limit = formData.get('profile_req_limit') as string;
    const organisation_description = formData.get('organisation_description') as string;
    const organisation_name = formData.get('organisation_name') as string;
    const organisation_email_id = formData.get('organisation_email_id') as string;
    const admin_to_email_id = formData.get('admin_to_email_id') as string;
    const admin_from_email_id = formData.get('admin_from_email_id') as string;
    const phone_no = formData.get('phone_no') as string;
    const address = formData.get('address') as string;
    const domain_url = formData.get('domain_url') as string;
    const copyright = formData.get('copyright') as string;

    const facebook = formData.get('facebook') as string;
    const twitter = formData.get('twitter') as string;
    const instagram = formData.get('instagram') as string; // Correct casing
    const youtube = formData.get('youtube') as string;

    const smtp_mail = formData.get('smtp_mail') as string;
    const smtp_password = formData.get('smtp_password') as string;
    const smtp_port = formData.get('smtp_port') as string;
    const smtp_host = formData.get('smtp_host') as string;
    const smtp_secure = formData.get('smtp_secure') as string;


    // Retrieve the Settings settings from the database
    const settings = await Settings.findOne({}) || new Settings();

    if (!settings) {
      return NextResponse.json({ error: 'settings not found' }, { status: 404 });
    }

    // Update the fields
    settings.organisation_description = organisation_description ?? "";
    settings.organisation_name = organisation_name ?? "";
    settings.organisation_email_id = organisation_email_id ?? "";
    settings.admin_to_email_id = admin_to_email_id ?? "";
    settings.admin_from_email_id = admin_from_email_id ?? "";
    settings.phone_no = phone_no ?? "";
    settings.address = address ?? "";
    settings.domain_url = domain_url ?? "";
    settings.copyright = copyright ?? "";
    settings.facebook = facebook ?? "";
    settings.twitter = twitter ?? "";
    settings.instagram = instagram ?? "";
    settings.youtube = youtube ?? "";
    settings.smtp_mail = smtp_mail ?? "";
    settings.smtp_password = smtp_password ?? "";
    settings.smtp_port = smtp_port ?? "";
    settings.smtp_host = smtp_host ?? "";
    settings.smtp_secure = smtp_secure ?? "";
    settings.profile_req_limit = profile_req_limit ?? "";


    // Update logo
    if (logo) {
      const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
      const fileExtension = path.extname(logo.name);
      const uniqueFileName = `${uniqueSuffix}${fileExtension}`;

      const filePath = path.join(UPLOAD_DIR, uniqueFileName);
      console.log('File Path:', filePath);

      const fileBuffer = Buffer.from(await logo.arrayBuffer());
      await fs.writeFile(filePath, fileBuffer);

      settings.logo = `/uploads/admin/${uniqueFileName}`;
    }


    // Save changes to the database
    await settings.save();

    console.log('Updated Settings:', settings);

    return NextResponse.json({
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
