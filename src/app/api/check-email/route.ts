import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const email = body.email;

    // Validate email input
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Check if the email exists in the database
    const user = await User.findOne({ email }); // Adjust according to your database query methods

    if (user) {
      return NextResponse.json({ exists: true, message: 'Email already exists' });
    }

    return NextResponse.json({ exists: false, message: 'Email is available' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
  }
}
