import { NextRequest, NextResponse } from 'next/server';
import City from '@/models/Cities'; // Import your cities model
import State from '@/models/States'; // Import your cities model

export const GET = async (req: NextRequest) => {
    try {
        // Get state_id from query parameters
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('state_id');
        // Ensure state_id is provided
        if (!id) {
            return NextResponse.json({ message: 'State ID is required' }, { status: 400 });
        }
        const data = await State.find({ _id : id });

        const stateId = data[0].state_id;

        console.log("stateId ID:", stateId); // Output: 30
        // Find cities based on the state_id
        
       
        let cities = await City.find({ state_id : stateId });
        console.log("cities ID:", cities); // Output: 30
       if(!cities) {
            cities = await City.find({ state_id : data[0]._id });
        }
      
        return NextResponse.json({
            data: cities,
        });
    } catch (error) {
        console.error('Error fetching cities:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
