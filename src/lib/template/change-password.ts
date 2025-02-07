export const changePasswordTemplate = (forgotPasswordLink: string, copyright: string,email: string, mail_logo: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
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
            font-family: 'Noto Sans', sans-serif;
        }
    
        h2 {
            color:rgb(0, 0, 0);
            font-size: 15px;
            font-weight: 400;
            margin-top: 1em;
            font-family: 'Noto Sans', sans-serif;
        }

        p {
            color: #000;
            line-height: 1.8;
            font-size: 14px;
            font-family: 'Noto Sans', sans-serif;
        }

        .logo {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo img {
            max-width: 500px;
        }

        .button {
            display: inline-block;
            background: linear-gradient(135deg, #FFB347, #FFD16C);
            color: #653D27 !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 30px;
            font-weight: bold;
            font-size: 16px;
            transition: 0.3s ease-in-out;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            margin-top: 1em;
            margin-bottom: 1em;
        }

        .button:hover {
            background: linear-gradient(135deg, #FFD16C, #FFB347);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }

        .text-red {
            color: #FF0000;
            font-size: 12px;
            font-weight: bold;
            font-family: 'Noto Sans', sans-serif;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #000;
            margin-top: 20px;
            font-family: 'Noto Sans', sans-serif;
        }
        .footer a{
            text-decoration:none;
            color: #000;
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
                            <img src="${mail_logo}" alt="TMSM Logo">
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <h1>Reset Your Password</h1>
                            <p>We received a request to reset your TMSM password. </p>
                            <p>Click the<strong> "Reset password" </strong>button below to access your account.</p>
                            <p style="text-align: center;">
                                <a href="${forgotPasswordLink}" class="button">
                                    Reset password
                                </a>
                            </p>
                            <p class="text-red">Note: If you didn't request this, please ignore this email, please contact our support team at <a href="mailto:${email}" style="color:#000;text-decoration:none;font-weight:bold">${email}</a>.</p>
                            
                            <!-- Thanks & Regards Section -->
                            <p style="margin-top: 30px; font-size: 12px; color:rgb(0, 0, 0);">
                                Thanks & Regards,<br>
                                <span style="color:rgb(0, 0, 0); font-size: 12px;">TMSM Team</span>
                            </p>
                            
                            <p class="footer">${copyright}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    
</html>`