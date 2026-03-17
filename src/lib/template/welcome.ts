export const welcomeTemplate = (userName: string, copyright: string): string =>
    `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to TMSM Hub</title>
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
                            <h1 style="color: #6f9c5d; font-size: 18px; font-weight: 700; margin-top: 2em; font-family: 'Noto Sans', sans-serif;">Registration Successful!</h1>
                            <h2 style="color: #000000; font-size: 15px; font-weight: 400; margin-top: 1em; font-family: 'Noto Sans', sans-serif;">Welcome, ${userName}!</h2>

                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;">Thank you for joining <strong>TMSM Hub</strong>, the trusted matrimony platform. We are thrilled to have you as a part of our community!</p>
                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;">We wish you all the best in your journey to find your perfect match.</p>
                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;">Once the admin approves your registration, you will be able to log in to TMSM Hub.</p>

                            <p style="color: #FF0000; font-size: 14px; font-weight: bold; font-family: 'Noto Sans', sans-serif;">
                                Note: that the admin reserves the right to remove or suspend any profile at any time, for any reason, without prior notice, to ensure the safety and integrity of our community.
                            </p>

                            <p style="margin-top: 30px; font-size: 12px; color: #000000; font-family: 'Noto Sans', sans-serif;">
                                <i>Thanks & Regards,<br>
                                <span style="color: #000000; font-size: 12px;">TMSM Hub Team</span></i>
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