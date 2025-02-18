import { NextRequest, NextResponse } from 'next/server';
import { verificationTemplate } from '@/lib/template/verification';
import { sendEmail } from "@/utils/mail.util"
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';

export async function GET(req: NextRequest) {

    // await connectToDatabase();

    // await User.deleteMany({
    //     _id: { $nin: ["6763efb8ef4bb11532dfa1b8", "676416e6ef4bb11532dfa37f"] },
    // });
        
    // const verificationLink = `${process.env.BASE_URL}/verify-email?code=123`;

    // const receipients = [{
    //     name: 'kaarthik',
    //     address: 'kaarthikr@searchnscore.com'
    // }]

    // const htmlBody = 'test mail';

    // const result = await sendEmail({
    //     receipients,
    //     subject: 'TMSM - verification!',
    //     message: htmlBody
    // });

    return NextResponse.json('test');
}