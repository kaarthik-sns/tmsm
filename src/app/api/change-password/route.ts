import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import Admin from '@/models/Admin';

export async function POST(request: NextRequest) {
    const { id, password, confirmPassword, is_admin } = await request.json();


    if (!id || !password || !confirmPassword) {
        return NextResponse.json({ message: 'Invalid verification code' }, { status: 400 });
    }

    try {

        await connectToDatabase();

        var user = await User.getById(id);

        if(is_admin) {
             user = await Admin.getById(id);
        }

        if (!user) {
            return NextResponse.json({ message: 'Invalid or expired verification link' }, { status: 400 });
        }

        if (confirmPassword !== password) {
            return NextResponse.json({ message: "Password does not match" }, { status: 400 })
        }
        
        if (password.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 character long" }, { status: 400 });
        }
        // Update user status to verified
        const hashedPassword = await bcrypt.hash(password, 10);
        
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: 'Your Password has been successfully Changed', is_admin : is_admin });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}
