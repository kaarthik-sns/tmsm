import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ProfileRequests from '@/models/Profile_requests';

export async function POST(request: NextRequest) {
    try {

        // Parse the incoming JSON payload

        const { id }: { id: string } = await request.json();

        await connectToDatabase();

        const SentRequestsData = await ProfileRequests.aggregate([
            {
                $lookup: {
                    from: 'users',
                    let: { receiverId: { $toObjectId: '$receiver_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$receiverId'] },
                                is_delete: false,
                                is_approve: true,
                                is_verify: true
                            }
                        },
                    ],
                    as: 'user',
                }
            },
            {
                $unwind: '$user' // Removes documents where no matching user is found
            },
            {
                $match: {
                    sender_id: id // Match where the sender_id matches the given id
                }
            },
            {
                $sort: { created_at: -1 } // Sort by created_at in reverse order
            }
        ]);


        const RecivedRequestsData = await ProfileRequests.aggregate([
            {
                $lookup: {
                    from: 'users',
                    let: { senderId: { $toObjectId: '$sender_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$senderId'] },
                                is_delete: false,
                                is_approve: true,
                                is_verify: true
                            }
                        },
                    ],
                    as: 'user',
                }
            },
            {
                $unwind: '$user' // Removes documents where no matching user is found
            },
            {
                $match: {
                    receiver_id: id // Match where the receiver_id matches the given id
                }
            },
            {
                $sort: { created_at: -1 } // Sort by created_at in reverse order
            }
        ]);


        // Prepare the response with pagination meta
        return NextResponse.json({
            SentRequestsData: SentRequestsData,
            RecivedRequestsData: RecivedRequestsData,
        });
    } catch (error) {
        console.error('Error fetching Requests:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
