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
                    $match: { _id: new mongoose.Types.ObjectId(id) } // Match user by ID
                },
                {
                    $lookup: {
                        from: 'cities', // Lookup cities collection
                        let: { cityIdStr: '$city_id' }, // Pass city_id as a variable
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$id', { $toInt: '$$cityIdStr' }] } // Convert city_id (string) to number
                                }
                            }
                        ],
                        as: 'city'
                    }
                },
                {
                    $lookup: {
                        from: 'states', // Lookup states collection
                        let: { stateIdStr: '$state_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$id', { $toInt: '$$stateIdStr' }] }
                                }
                            }
                        ],
                        as: 'state'
                    }
                },
                {
                    $lookup: {
                        from: 'countries', // Lookup countries collection
                        let: { countryIdStr: '$country_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$id', { $toInt: '$$countryIdStr' }] }
                                }
                            }
                        ],
                        as: 'country'
                    }
                },
                {
                    $unwind: { path: '$city', preserveNullAndEmptyArrays: true }
                },
                {
                    $unwind: { path: '$state', preserveNullAndEmptyArrays: true }
                },
                {
                    $unwind: { path: '$country', preserveNullAndEmptyArrays: true }
                }
            ]);
            


            userData = userDataArray.length > 0 ? userDataArray[0] : {};
        }

        console.log(userData);

        // Prepare the response with pagination meta
        return NextResponse.json({
            data: userData,
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
