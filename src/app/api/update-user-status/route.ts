import { NextRequest, NextResponse } from 'next/server';  // Use NextRequest and NextResponse from 'next/server'
import User from '@/models/User'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';

export async function PATCH(req: NextRequest) {
    const { id, is_active, is_approve } = await req.json();  // Read the JSON data from the request

    try {
        await connectToDatabase();
        const result = await User.updateOne(
            { _id: id },
            { $set: { is_active, is_approve } }
        );

        // Use NextResponse for success
        return NextResponse.json({ message: "Status updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating status:", error);

        // Use NextResponse for error
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
