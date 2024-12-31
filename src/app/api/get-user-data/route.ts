import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Admin from '@/models/Admin';

export const POST = async (req: NextRequest) => {
    try {
        // Get the request body (including userId and is_admin)
        const { id, is_admin } = await req.json();

        // Connect to the database
        await connectToDatabase();

        let user;

        // Fetch user data based on userId and whether the user is an admin
        if (is_admin) {
            user = await Admin.findById(id);  // Assuming Admin model has findById method
        } else {
            user = await User.findById(id);  // Assuming User model has findById method
        }

        // If no user is found, return an error response
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Return the user data
        return NextResponse.json({ data: user });

    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
