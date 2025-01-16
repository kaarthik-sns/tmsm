import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const name = searchParams.get('name') || '';
        const email = searchParams.get('email') || '';
        const is_active = searchParams.get('is_active') || '';
        const is_approve = searchParams.get('is_approve') || '';
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        // Connect to the database
        await connectToDatabase();

        // Build the query object
        const query: any = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Case-insensitive regex search
        }

        if (email) {
            query.email = { $regex: email, $options: 'i' }; // Case-insensitive regex search
        }

        if (is_active != '') {
            query.is_active = is_active;
        }

        if (is_approve != '') {
            query.is_approve = is_approve;
        }

        query.is_delete = { $ne: true };

        // Fetch filtered and paginated users from the database
        const users = await User.find(query).skip(skip).limit(pageSize);

        // Count total documents for the query
        const totalUsers = await User.countDocuments(query);

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: users,
            pagination: {
                currentPage: page,
                pageSize,
                totalUsers,
                totalPages: Math.ceil(totalUsers / pageSize),
            },
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
