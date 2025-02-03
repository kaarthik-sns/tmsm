import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Admin from '@/models/Admin';
import mongoose from 'mongoose';

export const POST = async (req: NextRequest) => {
    try {

        const { id, is_admin } = await req.json();

        // Connect to the database
        await connectToDatabase();
        let userData = {};

        if (is_admin) {
            userData = await Admin.findById(id);
        } else {

            // userData = await User.findById(id);

            const userDataArray = await User.aggregate([
                {
                    $match: { _id:  new mongoose.Types.ObjectId(id) } // Match user by ID
                },
                {
                    $lookup: {
                        from: 'cities', // Lookup cities collection
                        let: { cityId: { $toObjectId: '$city_id' } },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$cityId'] }
                                }
                            }
                        ],
                        as: 'city'
                    }
                },
                {
                    $lookup: {
                        from: 'states', // Lookup states collection
                        let: { stateId: { $toObjectId: '$state_id' } },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$stateId'] }
                                }
                            }
                        ],
                        as: 'state'
                    }
                },
                {
                    $unwind: { path: '$city', preserveNullAndEmptyArrays: true }
                },
                {
                    $unwind: { path: '$state', preserveNullAndEmptyArrays: true }
                }
            ]);

            userData = userDataArray.length > 0 ? userDataArray[0] : {};
        }

        console.log(userData)

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: userData,
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
