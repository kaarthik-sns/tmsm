import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import ProfileRequests from '@/models/Profile_requests';
import users_activity_log from '@/models/Users_activity_log';
import Payment from '@/models/Payment';
import Subscription from '@/models/Subscription';
import connectToDatabase from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'Invalid or expired verification link' }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 400 });
        }

        // Permanently delete all related profile requests (as sender or receiver)
        await ProfileRequests.deleteMany({
            $or: [{ sender_id: userId }, { receiver_id: userId }],
        });

        // Permanently delete all activity log entries for this user
        await users_activity_log.deleteMany({ user_id: userId });

        // Permanently delete all payment records for this user
        // await Payment.deleteMany({ userId });

        // Permanently delete all subscription records for this user
        // await Subscription.deleteMany({ userId });

        // Permanently delete the user document
        await User.deleteOne({ _id: userId });

        return NextResponse.json({ message: 'User has been permanently deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}
