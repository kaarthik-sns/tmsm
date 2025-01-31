import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request: NextRequest) {
    const { id, is_admin } = await request.json();

    if (!id) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        // Connect to database
        await connectToDatabase();

        let user;

        // If the user is an admin, check the Admin model
        if (is_admin === 'true') {
            user = await Admin.findById(id);
        } else {
            user = await User.findById(id); // Otherwise, check the User model
        }

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Update the user status to 'inactive' (deactivate the account)
        user.is_active = false; // Assuming 'is_active' is a field in your model that tracks active status

        // Save the user to the database
        await user.save();

        return NextResponse.json({ message: 'Your account has been deactivated successfully' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}
