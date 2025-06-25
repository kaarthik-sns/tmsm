export const sendReply = (
  name: string,
  message: string,
  copyright: string
): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reply to Your Inquiry</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap');

        body {
            margin: 0;
            padding: 0;
            background: #FFF7E7;
            font-family: 'Noto Sans', sans-serif;
            color: #333333;
        }

        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #fff7e7;
            padding: 25px;
            border-radius: 10px;
            border: 2px solid #fff7e7;
        }

        h1 {
            color: #6f9c5d;
            font-size: 18px;
            font-weight: 700;
            margin-top: 2em;
        }

        h2 {
            color: #000;
            font-size: 15px;
            font-weight: 400;
            margin-top: 1em;
        }

        p {
            color: #000;
            line-height: 1.8;
            font-size: 14px;
        }

        .logo {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo img {
            max-width: 500px;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #000;
            margin-top: 20px;
        }

        .footer a {
            text-decoration: none;
            color: #000;
        }

        .message {
            background-color: #fff3d4;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="container">
                    <tr>
                        <td align="center" class="logo">
                            <img src="cid:mail_logo" alt="TMSM Logo">
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <h1>Thank You for Reaching Out!</h1>
                            <h2>Dear ${name},</h2>
                            <p>We have received your message and appreciate you taking the time to get in touch with us.</p>
                            <p>Here’s our response:</p>

                            <div class="message">
                                ${message}
                            </div>

                            <p style="margin-top: 30px; font-size: 12px; color: rgb(0, 0, 0);">
                                <i>Thanks & Regards,<br>
                                <span style="color: rgb(0, 0, 0); font-size: 12px;">TMSM Hub Team</span></i>
                            </p>

                            <p class="footer"><i>${copyright}</i></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;