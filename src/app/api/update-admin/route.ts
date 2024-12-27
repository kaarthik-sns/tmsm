import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { promises as fs } from 'fs';
import path from 'path';

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

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

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

    // Retrieve the admin user from the database
    const user = await Admin.findById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Save the file path in the user document (relative to public)
    user.image = `/uploads/${file.name}`; // Adjusted path to public folder
    await user.save();

    return NextResponse.json({
      message: 'Image uploaded successfully',
      imagePath: `/uploads/${file.name}`, // Accessible via /uploads/{filename}
      is_admin: user.is_admin, // Assuming 'is_admin' is a field on the Admin model
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
