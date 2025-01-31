import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import States from '@/models/States';

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const country_id = searchParams.get('country_id') || ''; // Optional filter

        // Connect to MongoDB
        await connectToDatabase();

        // Query for states
        const query: any = {};
        if (country_id) {
            query.country_id = country_id;
        }

        // Fetch all matching states
        const states = await States.find(query).sort({ name: 1 });

        return NextResponse.json({ data: states });
    } catch (error) {
        console.error('Error fetching states:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
