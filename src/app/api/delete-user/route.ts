import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'Invalid or expired verification link' }, { status: 400 });
    }

    try {
        // Find user by email_code
        await connectToDatabase();
        const user = await User.getById(id);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 400 });
        }

        // Update user status to verified
        user.is_delete = true;
        await user.save();

        return NextResponse.json({ message: 'Your email has been successfully verified' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}
