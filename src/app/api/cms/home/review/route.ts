import { NextRequest, NextResponse } from 'next/server';
import Model from '@/models/Review';
import connectToDatabase from '@/lib/mongodb';


// Handle POST requests: Create a new entry
export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const formData = await request.formData();
        const name = (formData.get('name') as string) ?? '';
        const description = (formData.get('description') as string) ?? '';
        const rating = (formData.get('rating') as string) ?? '';

        const newRecord = new Model({ name, description, rating });
        await newRecord.save();

        return NextResponse.json({ message: 'Record created successfully.', data: newRecord });
    } catch (error) {
        console.error('Error creating record:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// Handle PUT requests: Update an existing entry
export async function PUT(request: NextRequest) {
    try {
        await connectToDatabase();

        const formData = await request.formData();
        const id = (formData.get('_id') as string) ?? '';
        const name = (formData.get('name') as string) ?? '';
        const description = (formData.get('description') as string) ?? '';
        const rating = (formData.get('rating') as string) ?? '';

        const Fields: Record<string, string> = { name, description, rating };

        const updatedRecord = await Model.findByIdAndUpdate(id, Fields, { new: true });

        if (!updatedRecord) {
            return NextResponse.json({ message: 'Record not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Record updated successfully.', data: updatedRecord });
    } catch (error) {
        console.error('Error updating record:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// Handle GET requests: Fetch an entry by ID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await connectToDatabase();

        const record = await Model.findById(id);

        if (!record) {
            return NextResponse.json({ message: 'Record not found.' }, { status: 404 });
        }

        return NextResponse.json({ data: record });
    } catch (error) {
        console.error('Error fetching record:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// Handle PATCH requests: Update an existing entry
export async function PATCH(req: NextRequest) {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ message: 'ID cannot be empty' }, { status: 400 });
    }

    try {
        // Find user by email_code
        await connectToDatabase();
        const dataModel = await Model.findById(id);

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