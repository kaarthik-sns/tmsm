import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import User from "@/models/User"; // Or Admin, depending on which user is making the request

export async function POST(request: NextRequest) {
  const { confirmPassword, password, id } = await request.json();

  if (!confirmPassword || !password) {
    return NextResponse.json(
      { message: "Current password and new password are required" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    let user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }


    if (password.length < 6) {
      return NextResponse.json(
        { message: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Hash the new password and update
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
