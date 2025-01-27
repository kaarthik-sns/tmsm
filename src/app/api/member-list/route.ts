import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getToken } from "next-auth/jwt";
import ProfileRequests from '@/models/Profile_requests';

export const GET = async (req: NextRequest) => {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        console.log(token);

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const lookingfor = searchParams.get('lookingfor') || '';
        const fromage = searchParams.get('fromage') || '';
        const toage = searchParams.get('toage') || '';
        const caste = searchParams.get('caste') || '';
        const subcaste = searchParams.get('subcaste') || '';

        // Connect to the database
        await connectToDatabase();

        // Build the query object
        const query: any = {};

        if (caste) {
            query.caste = { $regex: caste, $options: 'i' }; // Case-insensitive regex search
        }

        if (subcaste) {
            query.subcaste = { $regex: subcaste, $options: 'i' }; // Case-insensitive regex search
        }

        if (lookingfor) {
            query.lookingfor = { $regex: lookingfor, $options: 'i' }; // Case-insensitive regex search
        }

        if (fromage && toage) {
            query.age = { $gte: parseInt(fromage, 10), $lte: parseInt(toage, 10) };
        }

        if (token) {
            query._id = { $ne: token.id };
        }

        query.is_delete = false;
        query.is_approve = true;

        // Fetch filtered and paginated users from the database
        const users = await User.find(query).skip(skip).limit(pageSize);

        // Count total documents for the query
        const totalUsers = await User.countDocuments(query);
        interface Filters {
            sender_id?: string;
        }

        const filters: Filters = {}; // Declare 'filters' with the correct type


        // Add status filter if provided
        if (token) {
            filters.sender_id = token.id as string; // Direct match for status field
        }

        const ProfileRequestsData = await ProfileRequests.aggregate([
            {
                $lookup: {
                    from: 'users',
                    let: { receiverId: { $toObjectId: '$receiver_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$receiverId'] }
                            }
                        },
                    ],
                    as: 'receiver',
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { senderId: { $toObjectId: '$sender_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$senderId'] }
                            }
                        },
                    ],
                    as: 'sender',
                }
            },
            {
                $unwind: { path: '$receiver', preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: '$sender', preserveNullAndEmptyArrays: true }
            },
            {
                $match: filters
            }
        ]);

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: users,
            req_data: ProfileRequestsData,
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
