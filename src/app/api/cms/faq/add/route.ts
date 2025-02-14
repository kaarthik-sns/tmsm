import { NextRequest, NextResponse } from 'next/server';
 import Faq from '@/models/Faq'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';
export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        await connectToDatabase();

        const formData = await request.formData();
 
        // Extract only the title and description fields
        const title = (formData.get('title') as string) ?? '';
        const description = (formData.get('description') as string) ?? '';

        // Prepare the fields to be inserted into the database
        const FaqFields = { title, description };

        // Create the new faq with the fields
        const Faqs = await Faq.create(FaqFields);

        // Return success response
        return NextResponse.json({ message: 'FAQ have been successfully updated.', faq: Faqs });

    } catch (error) {
        console.error('Error creating FAQ:', error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}


