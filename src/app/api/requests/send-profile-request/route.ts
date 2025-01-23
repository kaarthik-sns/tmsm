import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ProfileRequests from '@/models/Profile_requests';

export async function POST(request: NextRequest) {

  try {

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
