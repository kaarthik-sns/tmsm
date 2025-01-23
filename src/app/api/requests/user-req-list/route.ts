import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ProfileRequests from '@/models/Profile_requests';

export async function POST(request: NextRequest) {
    try {

        // Parse the incoming JSON payload
        const { page, name, email, status }: { page: string, name: string, email: string, status: string } = await request.json();
        const parsedPage = parseInt(page || '1', 10);
        const pageSize = 10;
        const skip = (parsedPage - 1) * pageSize;

        await connectToDatabase();

        interface Filters {
            status?: string;
        }

        const filters: Filters = {}; // Declare 'filters' with the correct type

        const nameFilter = {
            $or: [
                { 'receiver.name': { $regex: name, $options: 'i' } }, // Case-insensitive match for receiver's name
                { 'sender.name': { $regex: name, $options: 'i' } } // Case-insensitive match for sender's name
            ]
        };

        // Add status filter if provided
        if (status) {
            filters.status = status; // Direct match for status field
        }

        const emailFilter = {
            $or: [
                { 'receiver.email': { $regex: email, $options: 'i' } }, // Case-insensitive match for receiver's email
                { 'sender.email': { $regex: email, $options: 'i' } } // Case-insensitive match for sender's email
            ]
        };

        // Apply both name and email filters if provided
        if (name && email) {
            filters['$and'] = [nameFilter, emailFilter]; // Both name and email filters must match
        } else {
            // If only one of them is provided, apply the corresponding filter
            if (name) filters['$or'] = nameFilter.$or;
            if (email) filters['$or'] = emailFilter.$or;
        }

        const ProfileRequestCount = await ProfileRequests.aggregate([
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
            },
            {
                $count: "totalCount" // Count the total number of matching documents
            }
        ]);

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
            },
            {
                $sort: { created_at: -1 } // Sort in reverse order based on createdAt or any field you prefer
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            }
        ]);


        const totalRequests = ProfileRequestCount[0].totalCount;

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: ProfileRequestsData,
            pagination: {
                currentPage: page,
                pageSize,
                totalRequests,
                totalPages: Math.ceil(totalRequests / pageSize),
            },
        });
    } catch (error) {
        console.error('Error fetching Requests:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
