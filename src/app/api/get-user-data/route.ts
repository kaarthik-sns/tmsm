import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Admin from '@/models/Admin';

export const POST = async (req: NextRequest) => {
    try {

        const { id, is_admin } = await req.json();

        // Connect to the database
        await connectToDatabase();


        var user = await User.getById(id);

        if (is_admin) {
            user = await Admin.getById(id);
        }

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: user,
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};