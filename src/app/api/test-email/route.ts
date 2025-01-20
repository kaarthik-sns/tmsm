import { NextRequest, NextResponse } from 'next/server';
import { verification } from '@/lib/template/verification';
import { sendEmail } from "@/utils/mail.util"
import * as Handlebars from 'handlebars';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    const verificationLink = `${process.env.BASE_URL}/verify-email?code=123`;

    // await connectToDatabase();

    // await User.deleteMany({
    //     _id: { $nin: ["6763efb8ef4bb11532dfa1b8", "676416e6ef4bb11532dfa37f"] },
    // });

    // return NextResponse.json('test');


    const sender = {
        name: 'TMSM',
        address: 'no-reply@tmsm.com'
    }

    const receipients = [{
        name: 'kaarthik',
        address: 'kaarthikr@searchnscore.com'
    }]

    const template = Handlebars.compile(verification);
    const htmlBody = template({
        verification_link: verificationLink,
    });

    const result = await sendEmail({
        sender,
        receipients,
        subject: 'TMSM - verification!',
        message: htmlBody
    });

    return NextResponse.json('test');
}