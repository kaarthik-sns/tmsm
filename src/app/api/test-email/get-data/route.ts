import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Model from '@/models/Home_page_slider';

export const POST = async (req: NextRequest) => {
    console.log(req);
    try {

        const { id } = await req.json();

        // Connect to the database
        await connectToDatabase();

        var data = await Model.getById(id);

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: data,
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
