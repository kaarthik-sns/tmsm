export const deactivateTemplate = (name: string, copyright: string, email: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>We're Sorry to See You Go - TMSM</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Noto Sans', sans-serif; color: #333333;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
        <tr>
            <td align="center" style="padding: 30px 0;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width: 600px; background-color: #FFF7E7; padding: 25px; border-radius: 10px; border: 2px solid #FFF7E7;">
                    <tr>
                        <td align="center" style="text-align: center; margin-bottom: 20px;">
                            <img src="cid:mail_logo" alt="TMSM Logo" style="max-width: 500px; display: block; margin: 0 auto;">
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="padding-top: 20px;">
                            <h1 style="color: #FF0000; font-size: 18px; font-weight: 700; margin-top: 2em; font-family: 'Noto Sans', sans-serif;">Account Deactivated Successfully!</h1>
                            <h2 style="color: #000000; font-size: 15px; font-weight: 400; margin-top: 1em; font-family: 'Noto Sans', sans-serif;">Hello ${name},</h2>
                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;">We hope this email finds you well.</p>
                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;">This is to inform you that your matrimony profile on <strong>TMSM Hub</strong> has been successfully deactivated. As per your request, your profile is no longer visible to other members.</p>
                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;">We appreciate your time with <strong>TMSM Hub</strong> and hope to serve you again in the future.</p>
                           
                            <p style="color: #FF0000; font-size: 12px; font-weight: bold; font-family: 'Noto Sans', sans-serif;"><i>Note: You will not be able to access your account until it is reactivated. If you wish to restore your profile, please contact our support team at <a href="mailto:${email}" style="color:#000000;text-decoration:none;font-weight:bold">${email}</a>.</i></p>
                            
                            <!-- Thanks & Regards Section -->
                            <p style="margin-top: 30px; font-size: 12px; color: #000000; font-family: 'Noto Sans', sans-serif;">
                                <i>Thanks & Regards,<br>
                                <span style="color:#000000; font-size: 12px;">TMSM Hub Team</span></i>
                            </p>
                            
                            <p align="center" style="text-align: center; font-size: 12px; color: #000000; margin-top: 20px; font-family: 'Noto Sans', sans-serif;">
                                <i>${copyright}</i>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
