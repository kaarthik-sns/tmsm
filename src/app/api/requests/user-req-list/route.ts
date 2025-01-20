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

        const query: any = {};

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

        const ProfileRequest = await ProfileRequests.aggregate([
            {
                $lookup: {
                    from: 'users', // Lookup to 'users' collection for receiver
                    let: { receiverId: { $toObjectId: '$receiver_id' } }, // Convert receiver_id to ObjectId
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$receiverId'] } // Match on receiver_id
                            }
                        },
                    ],
                    as: 'receiver', // Join receiver data
                }
            },
            {
                $lookup: {
                    from: 'users', // Lookup to 'users' collection for sender
                    let: { senderId: { $toObjectId: '$sender_id' } }, // Convert sender_id to ObjectId
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$senderId'] } // Match on sender_id
                            }
                        },
                    ],
                    as: 'sender', // Join sender data
                }
            },
            {
                $unwind: {
                    path: '$receiver', // Unwind the receiver array
                    preserveNullAndEmptyArrays: true, // Keep the document even if no matching receiver is found
                }
            },
            {
                $unwind: {
                    path: '$sender', // Unwind the sender array
                    preserveNullAndEmptyArrays: true, // Keep the document even if no matching sender is found
                }
            },
            {
                $match: filters, // Apply filters for name or email if provided
            },
            {
                $skip: skip, // Skip for pagination
            },
            {
                $limit: pageSize, // Limit for pagination
            }
        ]);

        const totalRequests = await ProfileRequests.countDocuments(query);

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: ProfileRequest,
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
