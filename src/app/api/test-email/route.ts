import { NextRequest, NextResponse } from 'next/server';
import { verification } from '@/lib/template/verification';
import { sendEmail } from "@/utils/mail.util"
import * as Handlebars from 'handlebars';

export async function GET(req: NextRequest) {
    const verificationLink = `${process.env.BASE_URL}/verify-email?code=123`;

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
    })
}
