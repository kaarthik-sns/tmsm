import { NextRequest, NextResponse } from 'next/server';
import Term from '@/models/Terms'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';

export async function POST(request: NextRequest) {

    const formData = await request.formData();

    // Extract all fields from formData
    const description = (formData.get('description') as string) ?? '';

    try {
        await connectToDatabase();

        let model = await Term.findOne();

        if (!model) {
            model = new Term({ description });
        } else {
            model.description = description || model.description;
        }

        await model.save();

        return NextResponse.json({ message: 'Terms & conditions saved successfully.' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }

}
