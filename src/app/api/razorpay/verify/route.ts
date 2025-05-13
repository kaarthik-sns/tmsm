import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Subscription from '@/models/Subscription';

interface VerifyRequestBody {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
    userId: string;
}

export async function POST(req: NextRequest) {
    await connectToDatabase();

    const data: VerifyRequestBody = await req.json();

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount   
     } = data;
     
    const userId = '1';
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
        .update(body)
        .digest('hex');

    if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ message: 'Signature mismatch' }, { status: 400 });
    }

    try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        const subscription = await Subscription.create({
            userId,
            planName: 'basic',
            startDate,
            endDate,
            status: 'active',
        });

        await Payment.create({
            userId,
            subscriptionId: subscription._id.toString(),
            amount,
            paymentStatus: 'success',
            transactionId: razorpay_payment_id,
            paidAt: new Date(),
        });

        return NextResponse.json({ message: 'Payment verified and saved.' }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}