import { NextRequest, NextResponse } from 'next/server';
import ProfileRequests from '@/models/ProfileRequests';
import connectToDatabase from '@/lib/mongodb';

export async function PATCH(req: NextRequest) {

    console.log(req);
    try {
        const { id, status } = await req.json();  // Read the JSON data from the request

        // Validate the id and status
        if (!id || !status) {
            return NextResponse.json(
                { error: "Invalid request: missing 'id' or 'status'" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Update the status
        const result = await ProfileRequests.updateOne(
            { _id: id },  // Ensure id is cast to ObjectId
            { $set: { status } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { error: "No record updated, please check the id" },
                { status: 404 }
            );
        }

        // Return success response
        return NextResponse.json(
            { message: "Status updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating status:", error);

        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
