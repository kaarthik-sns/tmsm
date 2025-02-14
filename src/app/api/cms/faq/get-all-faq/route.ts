import { NextResponse } from 'next/server';
import Model from '@/models/Faq';
import connectToDatabase from '@/lib/mongodb';


// Handle GET requests: Fetch an entry by ID
export async function GET() {
    try {

        await connectToDatabase();

        const record = await Model.find({});

        if (!record) {
            return NextResponse.json({ message: 'Record not found.' }, { status: 404 });
        }

        return NextResponse.json({ data: record });
    } catch (error) {
        console.error('Error fetching record:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

