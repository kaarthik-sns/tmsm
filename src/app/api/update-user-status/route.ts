import { NextRequest, NextResponse } from 'next/server';  // Use NextRequest and NextResponse from 'next/server'
import User from '@/models/User'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';
import { adminApprovalTemplate } from '@/lib/template/admin-approve';
import { accountReactivationTemplate } from '@/lib/template/account-active';
import { deactivateTemplate } from '@/lib/template/deactivated';
import getSMTPSettings from '@/utils/settings.util';
import { sendEmail } from "@/utils/mail.util"

export async function PATCH(req: NextRequest) {
    const { id, is_active, is_approve } = await req.json();  // Read the JSON data from the request

    try {
        await connectToDatabase();
        const result = await User.updateOne(
            { _id: id },
            { $set: { is_active, is_approve } }
        );

        let copyright = '';
        let contactMail = '';

        const smtpSettings = await getSMTPSettings();
        if (smtpSettings) {
            copyright = `© ${new Date().getFullYear()} ${smtpSettings.copyright}`;
            contactMail = smtpSettings.organisation_email_id;
            
        }

        const userData = await User.findById(id);
        const name = userData.name;
        const email = userData.email;
        const homePage = process.env.BASE_URL + '/login';

        let htmlBody = '';

        if (is_active == false) {

            const receipients = [{
                name: name,
                address: email
            }];


            htmlBody = deactivateTemplate(name, copyright, contactMail);

            await sendEmail({
                receipients,
                subject: '*Important* TMSM Account Deactivation Notice',
                message: htmlBody
            });

        }

        const receipients = [{
            name: name,
            address: email
        }];

        if (is_approve) {

            htmlBody = adminApprovalTemplate(name, homePage, contactMail, copyright);

            await sendEmail({
                receipients,
                subject: 'Congratulations! Your TMSM Account is Approved and Ready',
                message: htmlBody
            });

        }


        if (is_active) {

            htmlBody = accountReactivationTemplate(name, homePage, contactMail, copyright);

            await sendEmail({
                receipients,
                subject: '*Important* TMSM Account Activation Notice',
                message: htmlBody
            });

        }

        // Use NextResponse for success
        return NextResponse.json({ message: "Status updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating status:", error);

        // Use NextResponse for error
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
