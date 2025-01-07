import { NextRequest, NextResponse } from 'next/server';
 import Term from '@/models/Terms'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';
export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        await connectToDatabase();

        const formData = await request.formData();
        // Extract only the title and description fields
        const description = (formData.get('description') as string) ?? '';

        // Prepare the fields to be inserted into the database
        const TermFields = {description };

        // Create the new Terms with the fields
        const Terms = await Term.create(TermFields);

        // Return success response
        return NextResponse.json({ message: 'FAQ have been successfully updated.', term: Terms });

    } catch (error) {
        console.error('Error creating FAQ:', error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}


