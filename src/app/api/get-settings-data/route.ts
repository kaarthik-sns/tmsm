import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Settings from '@/models/Settings';

export const POST = async (req: NextRequest) => {
    try {

        // Connect to the database
        await connectToDatabase();

        var settings = await Settings.findOne({});

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: settings,
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
