import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ProfileRequests from '@/models/Profile_requests';


export async function POST(request: NextRequest) {

  try {

    // Connect to the database
    await connectToDatabase();

    // Parse the incoming JSON payload
    const { id, sender_id, receiver_id, status }: {
      id?: string;
      sender_id: string;
      receiver_id: string;
      status?: string;
    } = await request.json();

    // Validate required fields
    if (!sender_id || !receiver_id) {
      return NextResponse.json(
        { message: 'Sender ID and Receiver ID are required' },
        { status: 400 }
      );
    }

    let message: string;

    if (id) {
      // Update existing notification
      const notification = await ProfileRequests.findOne({ _id: id });

      if (!notification) {
        return NextResponse.json(
          { message: 'Notification not found for the provided ID' },
          { status: 404 }
        );
      }

      // Update fields
      notification.sender_id = sender_id;
      notification.receiver_id = receiver_id;
      if (status) notification.status = status;

      await notification.save();
      message = 'Notification updated successfully';
    } else {
      // Create a new notification
      const newNotification = new ProfileRequests({
        sender_id,
        receiver_id,
        status: status || 'pending' // Default to 'pending' if no status provided
      });

      await newNotification.save();
      message = 'Notification created successfully';
    }

    // Return success response
    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);

    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
