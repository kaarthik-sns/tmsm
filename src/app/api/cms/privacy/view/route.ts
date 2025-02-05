import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Privacy from '@/models/Privacy';

export const POST = async (req: NextRequest) => {
    try {

        // const { id } = await req.json();

        // Connect to the database
        await connectToDatabase();

        var Term = await Privacy.findOne({});

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: Term,
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
