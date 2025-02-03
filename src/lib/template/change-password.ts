export const changePasswordTemplate = (forgotPasswordLink: string, copyright: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
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
            margin: 18px auto;
            background: #00000000;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0px 0px 20px 0px #c8c8c8 !important;
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
            background-color: #FFD16C;
            color: #653D27 !important;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
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
        <h1>Reset Your Password</h1>
        <p>We received a request to reset your TMSM password. Click the button below to proceed </p>
        <a href="${forgotPasswordLink}" class="button">Reset password</a>
        <p>If you didn't request this, please ignore this email.</p>
       
        <div class="footer">
            <p>${copyright}</p>
        </div>
    </div>
</body>
</html>`