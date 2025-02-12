import { NextRequest, NextResponse } from 'next/server';
import ProfileRequests from '@/models/Profile_requests';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';
import { replyProfileRequestTemplate } from '@/lib/template/reply-profile-request';
import { sendEmail } from "@/utils/mail.util"
import getSMTPSettings from '@/utils/settings.util';

export async function PATCH(req: NextRequest) {

    try {
        const { id, status } = await req.json();  // Read the JSON data from the request

        // Validate the id and status
        if (!id || !status) {
            return NextResponse.json(
                { error: "Invalid request: missing 'id' or 'status'" },
                { status: 400 }
            );
        }

        let copyright = '';
        let contactMail = '';
        let baseUrl = process.env.BASE_URL || '';  // ✅ Get BASE_URL from .env
        //let mail_logo = `${baseUrl}/images/logo/Flogo.svg`;  // ✅ Construct full path dynamically
        let mail_logo = `https://searchnscore.in/tmsm/images/mail-logo.png?t=${new Date().getTime()}`;

        const smtpSettings = await getSMTPSettings();
        if (smtpSettings) {
            copyright = `© ${new Date().getFullYear()} ${smtpSettings.copyright}`;
            contactMail = smtpSettings.organisation_email_id;
        }

        await connectToDatabase();

        const objectId = new mongoose.Types.ObjectId(id);

        const ProfileRequestData = await ProfileRequests.aggregate([
            {
                $lookup: {
                    from: 'users',
                    let: { receiverId: { $toObjectId: '$receiver_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$receiverId'] }
                            }
                        },
                    ],
                    as: 'receiver',
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { senderId: { $toObjectId: '$sender_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$senderId'] }
                            }
                        },
                    ],
                    as: 'sender',
                }
            },
            {
                $unwind: { path: '$receiver', preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: '$sender', preserveNullAndEmptyArrays: true }
            },
            { $match: { _id: objectId } }
        ]);


        let receipients = [];
        let htmlBody = '';
        let name = '';
        let email = '';
        let name2 = '';
        const link = process.env.BASE_URL+'/login';
        let content = '';
        let subjects = '';
        let name3 = '';


        if (ProfileRequestData.length > 0) {
            const reqData = ProfileRequestData[0];

            if (status === 'cancel') {

                name = reqData.receiver.name;
                email = reqData.receiver.email;

                name2 = reqData.sender.name;
                name3 = reqData.sender.name;

                subjects = `TMSM - ${name3} Has Canceled Their Profile View Request`;
                
                content = `We wanted to inform you that <b>${name3}</b> has <b style="color:red">canceled</b> their profile view request. <p>We sincerely apologize for any inconvenience this may have caused. However, you can still explore other profiles and send new requests to connect with potential matches.</p>`;
                //content = `The profile view request from ${name2} has been <b>canceled</b>.<p>If you were interested, you can explore more profiles and connect with others on TMSM.</p>`;

                receipients = [{
                    name: name,
                    address: email
                }]

                htmlBody = replyProfileRequestTemplate(name, link, content, copyright, contactMail, mail_logo, status);

            } else if (status === 'accepted') {

                name = reqData.sender.name;
                email = reqData.sender.email;

                name2 = reqData.receiver.name;

                subjects = `TMSM - ${name2} Has Accepted Your Profile View Request`;

                content = `Your profile view request has been <strong style="color:green">accepted</strong> by <strong>${name2}</strong>, <p>You can now view their profile and connect with them.</p> <p>Click the<strong> "Login" </strong>button below to access your account.</p>`;


                receipients = [{
                    name: name,
                    address: email
                }]

                htmlBody = replyProfileRequestTemplate(name, link, content, copyright, contactMail, mail_logo, status);

            } else if (status === 'rejected') {

                name = reqData.sender.name;
                email = reqData.sender.email;

                name2 = reqData.receiver.name;

                subjects = `TMSM - ${name2} Has Rejected Your Profile View Request`;

                content = `Unfortunately, your profile view request to <strong>${name2}</strong> has been <strong style="color:red">rejected</strong>. <p>Don't worry! Keep exploring and connecting with other profiles on TMSM.</p>`;


                receipients = [{
                    name: name,
                    address: email
                }]

                htmlBody = replyProfileRequestTemplate(name, link, content, copyright, contactMail, mail_logo, status);

            }

            if (status != 'pending') {
                const result = await sendEmail({
                    receipients,
                    subject: subjects,
                    message: htmlBody
                });
            }

            if (status === 'cancel') {
                // Delete the record if status is 'cancel'
                await ProfileRequests.deleteOne({ _id: id }); // Ensure id is cast to ObjectId
            } else {
                // Update the status if not 'cancel'
                await ProfileRequests.updateOne(
                    { _id: id },  // Ensure id is cast to ObjectId
                    { $set: { status } }
                );
            }

            // Return success response
            return NextResponse.json(
                { message: "Status updated successfully" },
                { status: 200 }
            );
        } else {
            return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
        }
    } catch (error) {
        console.error("Error updating status:", error);

        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
