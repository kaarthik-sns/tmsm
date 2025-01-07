import { NextRequest, NextResponse } from 'next/server';
import Term from '@/models/Terms'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';

export async function POST(request: NextRequest) {

    const formData = await request.formData();

    // Extract all fields from formData
    const id = (formData.get('_id') as string) ?? '';
    const description = (formData.get('description') as string) ?? '';
   

    if (!id) {
        return NextResponse.json({ message: 'Faq ID is required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const Terms = await Term.findById(id); // Ensure this method exists in User model

        if (!Term) {
            return NextResponse.json({ message: 'Terms not found or invalid ID' }, { status: 404 });
        }

       
        // Prepare the updated fields (only fields provided will be updated)
        const updatedFields = {
            description: description || Terms.description,
        };

        // Use findByIdAndUpdate for efficient update
        const updatedFaq= await Term.findByIdAndUpdate(id, updatedFields, { new: true });

        return NextResponse.json({ message: 'Faq details have been successfully updated.', faq: updatedFaq });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}
