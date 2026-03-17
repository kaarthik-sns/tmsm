export const contactUsTemplate = (name: string, email: string, phone: string, message: string, copyright: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us Inquiry</title>
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
                            <h1 style="color: #6f9c5d; font-size: 18px; font-weight: 700; margin-top: 2em; font-family: 'Noto Sans', sans-serif;">New Contact Inquiry</h1>
                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;"><strong>Name:</strong> ${name}</p>
                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#000000;text-decoration:none;">${email}</a></p>
                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;"><strong>Phone:</strong> ${phone}</p>
                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;"><strong>Message:</strong></p>
                            <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;">${message}</p>
                            
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
