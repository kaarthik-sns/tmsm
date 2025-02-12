import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Faq from '@/models/Faq';
import Admin from '@/models/Admin';

export const POST = async (req: NextRequest) => {
    try {

        const { id, is_admin } = await req.json();

        // Connect to the database
        await connectToDatabase();

        var faq = await Faq.findById(id);

        if (is_admin) {
            faq = await Admin.findById(id);
        }

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: faq,
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
