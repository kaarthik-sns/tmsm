import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Model from '@/models/Review';

export const GET = async (req: NextRequest) => {

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        // Connect to the database
        await connectToDatabase();

        // Build the query object
        const query: any = {};

        query.is_delete = { $ne: true };

        // Fetch filtered and paginated users from the database
        const data = await Model.find(query).skip(skip).limit(pageSize);

        // Count total documents for the query
        const totalData = await Model.countDocuments(query);

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: data,
            pagination: {
                currentPage: page,
                pageSize,
                totalData,
                totalPages: Math.ceil(totalData / pageSize),
            },
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
