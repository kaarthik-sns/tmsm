import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Terms from '@/models/Terms';

export const POST = async (req: NextRequest) => {
    try {

        // Connect to the database
        await connectToDatabase();

        var Term = await Terms.findOne({});

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: Term,
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
