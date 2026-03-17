export const profileViewRequestTemplate = (recName: string, sentName: string, homePage: string, copyright: string, email: string): string =>
    `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Profile View Request</title>
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
                            <h1 style="color: #6f9c5d; font-size: 18px; font-weight: 700; margin-top: 2em; font-family: 'Noto Sans', sans-serif;">New Profile Request Awaiting Your Response!</h1>
                            <h2 style="color: #000000; font-size: 15px; font-weight: 400; margin-top: 1em; font-family: 'Noto Sans', sans-serif;">Hello ${recName},</h2>
                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;">You have received a new profile view request from <strong>${sentName}</strong>.</p>
                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;">You can choose to <strong>Accept</strong> or <strong>Reject</strong> the request at your convenience.</p>
                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;">Click the<strong> "Login to Respond" </strong>button below to access your account.</p>
                            <p style="text-align: center; margin: 20px 0;">
                                <a href="${homePage}" style="display: inline-block; background: linear-gradient(135deg, #FFB347, #FFD16C); color: #653D27 !important; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);">
                                    Login to Respond
                                </a>
                            </p>
                            <p style="color: #FF0000; font-size: 12px; font-weight: bold; font-family: 'Noto Sans', sans-serif;">Note: If you have any questions, please contact our support team at <a href="mailto:${email}" style="color:#000000;text-decoration:none;font-weight:bold">${email}</a>.</p>
                            
                            <p style="margin-top: 30px; font-size: 12px; color: #000000; font-family: 'Noto Sans', sans-serif;">
                                Thanks & Regards,<br>
                                <span style="color:#000000; font-size: 12px;">TMSM Hub Team</span>
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
