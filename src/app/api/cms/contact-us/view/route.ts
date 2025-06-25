import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Model from '@/models/Contact_us_template';

export const POST = async (req: NextRequest) => {
    try {

        // Connect to the database
        await connectToDatabase();

        var data = await Model.findOne({});

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: data,
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};


export const GET = async (req: NextRequest) => {
    try {

        // Connect to the database
        await connectToDatabase();

        var data = await Model.findOne({});

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: data,
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};