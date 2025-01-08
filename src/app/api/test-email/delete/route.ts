import { NextRequest, NextResponse } from 'next/server';
import Model from '@/models/Home_page_slider';
import connectToDatabase from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    try {
        // Find user by email_code
        await connectToDatabase();
        const dataModel = await Model.getById(id);

        if (!dataModel) {
            return NextResponse.json({ message: 'Data not found' }, { status: 400 });
        }

        // Update user status to verified
        dataModel.is_delete = true;
        await dataModel.save();

        return NextResponse.json({ message: 'Data has been deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}
