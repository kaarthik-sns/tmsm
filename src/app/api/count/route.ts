import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const POST = async (req: NextRequest) => {
    try {
        // Connect to the database
        await connectToDatabase();

        // Get total count of users
        const totalUsers = await User.countDocuments();

        // Get waiting for approval users count (is_approve: false)
        const waitingForApproval = await User.countDocuments({ is_approve: false });

        // Get active users count (is_active: true, is_approve: true)
        const activeUsers = await User.countDocuments({ is_active: true, is_approve: true });

        // Return all counts
        return NextResponse.json({
            totalUsers,
            waitingForApproval,
            activeUsers
        });

    } catch (error) {
        console.error('Error fetching user counts:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
