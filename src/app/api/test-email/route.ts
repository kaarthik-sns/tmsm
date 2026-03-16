import { NextRequest, NextResponse } from 'next/server';
import { verificationTemplate } from '@/lib/template/verification';
import { sendEmail } from "@/utils/mail.util"
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';
import { welcomeTemplate } from '@/lib/template/welcome';
import Contact from '@/models/Contact';

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

    // const receipients = [{
    //     name: 'kaarthik',
    //     address: 'kaarthikr@searchnscore.com'
    // }]
    // const copyright = 'All rights reserved tmsm.com.';

    // const htmlBody = welcomeTemplate('kaarthik', copyright);

    // const result = await sendEmail({
    //     receipients,
    //     subject: `Welcome to TMSM, kaarthik!`,
    //     message: htmlBody
    // })

    // const generateDummyContact = (i) => ({
    //     name: `User ${i}`,
    //     email: `user${i}@example.com`,
    //     interested_in: ['Room Booking', 'Event', 'Conference'][i % 3],
    //     phone: `9876543${100 + i}`,
    //     message: `This is a test message number ${i}`,
    // });

    // const dummyContacts = Array.from({ length: 40 }, (_, i) =>
    //     generateDummyContact(i + 1)
    // );

    // Insert into the DB
    // await Contact.insertMany(dummyContacts);

     console.log('⏰ Cron running at', new Date());

    return NextResponse.json('test');
}