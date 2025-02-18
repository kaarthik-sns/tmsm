import { NextRequest, NextResponse } from 'next/server';
import Faq from '@/models/Faq'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';

export async function POST(request: NextRequest) {

    const formData = await request.formData();

    // Extract all fields from formData
    const id = (formData.get('_id') as string) ?? '';
    const title = (formData.get('title') as string) ?? '';
    const description = (formData.get('description') as string) ?? '';
   
console.log(title,description);

    if (!id) {
        return NextResponse.json({ message: 'Faq ID cannot be empty' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const faq = await Faq.findById(id); // Ensure this method exists in User model

        if (!faq) {
            return NextResponse.json({ message: 'Faq not found or invalid ID' }, { status: 404 });
        }

       
        // Prepare the updated fields (only fields provided will be updated)
        const updatedFields = {
            title: title || faq.title,
            description: description || faq.description,
            updated_at: new Date()
        };

        // Use findByIdAndUpdate for efficient update
        const updatedFaq= await Faq.findByIdAndUpdate(id, updatedFields, { new: true });

        return NextResponse.json({ message: 'Faq details have been successfully updated.', faq: updatedFaq });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}
