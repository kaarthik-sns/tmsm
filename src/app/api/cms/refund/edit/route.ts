import { NextRequest, NextResponse } from 'next/server';
import Refund from '@/models/Refund'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';

export async function POST(request: NextRequest) {

    const formData = await request.formData();

    // Extract all fields from formData
    const description = (formData.get('description') as string) ?? '';
    const description_ta = (formData.get('description_ta') as string) ?? '';

    try {
        await connectToDatabase();

        let model = await Refund.findOne();

        if (!model) {
            model = new Refund({ description, description_ta });
        } else {
            model.description = description || model.description;
            model.description_ta = description_ta || model.description_ta;
        }

        await model.save();

        return NextResponse.json({ message: 'Refund policy saved successfully.' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}
