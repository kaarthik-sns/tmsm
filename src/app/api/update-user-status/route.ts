import { NextRequest, NextResponse } from 'next/server';  // Use NextRequest and NextResponse from 'next/server'
import User from '@/models/User'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';
import { adminApprovalTemplate } from '@/lib/template/admin-approve';
import { accountReactivationTemplate } from '@/lib/template/account-active';
import { deactivateTemplate } from '@/lib/template/deactivated';
import getSMTPSettings from '@/utils/settings.util';
import { sendEmail } from "@/utils/mail.util"

export async function PATCH(req: NextRequest) {
    const { id, is_active, is_approve, reason = null, reactivate_reason = null } = await req.json();

    if (!id) {
        return NextResponse.json({ error: "Something went wrong please try again later!" }, { status: 500 });
    }

    try {
        await connectToDatabase();
        const updateFields: Record<string, any> = { is_active, is_approve };

        // Only add `deactivate_reason` if `reason` is provided
        if (reason) {
            updateFields.deactivate_reason = reason;
        }

        // Only add `reactivate_reason` if `reason` is provided
        if (reactivate_reason) {
            updateFields.reactivate_reason = reactivate_reason;
        }


        const result = await User.updateOne(
            { _id: id },
            { $set: updateFields }
        );

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

        const userData = await User.findById(id);
        const name = userData.name;
        const email = userData.email;
        const homePage = process.env.BASE_URL + '/login';

        let htmlBody = '';

        if (is_active === false) {
            const receipients = [{ name, address: email }];
            htmlBody = deactivateTemplate(name, copyright, contactMail, mail_logo);

            await sendEmail({
                receipients,
                subject: '*Important* TMSM Account Deactivation Notice',
                message: htmlBody
            });
        }

        const receipients = [{ name, address: email }];

        if (is_approve) {
            htmlBody = adminApprovalTemplate(name, homePage, contactMail, copyright, mail_logo);
            await sendEmail({
                receipients,
                subject: 'Congratulations! Your TMSM Account is Approved and Ready',
                message: htmlBody
            });
        }

        if (is_active) {
            htmlBody = accountReactivationTemplate(name, homePage, contactMail, copyright, mail_logo);
            await sendEmail({
                receipients,
                subject: '*Important* TMSM Account Activation Notice',
                message: htmlBody
            });
        }

        return NextResponse.json({ message: "Status updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating status:", error);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
