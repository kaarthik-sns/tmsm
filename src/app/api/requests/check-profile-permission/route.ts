import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ProfileRequests from '@/models/Profile_requests';

export async function POST(request: NextRequest) {
    try {
        // Parse the incoming JSON payload
        const { id, userId }: { id: string; userId: string } = await request.json();

        await connectToDatabase();  // Make sure to connect to DB

        // Query for accepted profile request where either sender_id or receiver_id matches the provided ids
        const profileRequest = await ProfileRequests.findOne({
            $or: [
                { sender_id: userId, receiver_id: id },
                { sender_id: id, receiver_id: userId }
            ],
            status: 'accepted'  // Ensure the status is 'accepted'
        });

        if (!profileRequest) {
            return NextResponse.json({ message: 'Profile data not found' }, { status: 404 });
        }

        // Prepare the response with the found data
        return NextResponse.json({
            message: 'Accepted profile data found',
            data: profileRequest
        });

    } catch (error) {
        console.error('Error fetching Profile Data:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
