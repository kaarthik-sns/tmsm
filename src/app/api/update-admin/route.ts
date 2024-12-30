import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Adjust the size limit as needed
    },
  },
};

export async function POST(req: NextRequest) {

  const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads'); // Save in the public directory
  
  try {
    // Connect to the database
    await connectToDatabase();

    // Ensure the uploads directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Parse the form data
    const formData = await req.formData();
    console.log('Form Data:', formData);

    const file = formData.get('profilePic') as File;
    const id = formData.get('id') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    // Retrieve the admin user from the database
    const user = await Admin.findById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // update profile pic
    if (file) {
      // Debugging the file details
      console.log('File Details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      });

      // Construct the file path within the public/uploads folder
      const filePath = path.join(UPLOAD_DIR, file.name);
      console.log('File Path:', filePath);

      // Save the file to the server
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, fileBuffer);

      // Save the file path in the user document (relative to public)
      user.image = `/uploads/${file.name}`; // Adjusted path to public folder
    }

    // update password
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // update name
    if (name) {
      user.name = name;
    }

    // update email
    if (email) {
      user.email = email;
    }

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
