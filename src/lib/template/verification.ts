export const verification = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color:#f5f6f8 !important;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
        }
        p {
            color: #666666;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            background-color: #007BFF;
            color: #ffffff !important;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #999999;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Verify Your Email</h1>
        <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the button below.</p>
        <p>If you did not sign up for this account, you can safely ignore this email.</p>
        <a href="{{verification_link}}" class="button">Verify Email</a>
        <p>If the button doesn't work, copy and paste the following link into your browser:</p>
        <p>{{verification_link}}</p>
        <div class="footer">
            <p>© 2024 tmsm.com. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`