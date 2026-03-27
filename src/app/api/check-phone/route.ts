import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const phonenumber = body.phonenumber;
    const userId = body.userId;

    // Validate phone input
    if (!phonenumber || !/^\d{10}$/.test(phonenumber)) {
      return NextResponse.json({ message: 'Invalid phone format. Must be 10 digits.' }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Check if the phone exists in the database, excluding the current user if userId is provided
    const query: any = { phonenumber };
    if (userId) {
      query._id = { $ne: userId };
    }
    const user = await User.findOne(query);

    if (user) {
      return NextResponse.json({ exists: true, message: 'Phone number already exists' });
    }

    return NextResponse.json({ exists: false, message: 'Phone number is available' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
  }
}
