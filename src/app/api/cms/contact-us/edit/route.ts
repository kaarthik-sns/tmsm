import { NextRequest, NextResponse } from 'next/server';
import ContactUsTemplate from '@/models/Contact_us_template';
import connectToDatabase from '@/lib/mongodb';

export async function POST(request: NextRequest) {

    const formData = await request.formData();

    // Extract all fields from formData
    const description = (formData.get('description') as string) ?? '';
    const description_ta = (formData.get('description_ta') as string) ?? '';

    try {
        await connectToDatabase();

        let model = await ContactUsTemplate.findOne();
        
        if (!model) {
            model = new ContactUsTemplate({ description, description_ta });
        } else {
            model.description = description || model.description;
            model.description_ta = description_ta || model.description_ta;
        }

        await model.save();

        return NextResponse.json({ message: 'saved successfully.' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }

}
