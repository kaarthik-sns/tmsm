export const adminApprovalTemplate = (name: string, loginUrl: string, copyright: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Approved</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333333;
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
            color: #28a745;
        }
        p {
            color: #666666;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #999999;
        }
        .details {
            margin-top: 20px;
            border: 1px solid #dddddd;
            padding: 15px;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .highlight {
            font-weight: bold;
            color: #28a745;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #28a745;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        a[href] {
                color: #ffffff !important;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Account Approved</h1>
        <p>Hello <span class="highlight">${name}</span>,</p>
        <p>We are pleased to inform you that your account has been approved. You can now log in using the same password you set during registration.</p>
        <p>Click the button below to access your account:</p>
        <p><a href="${loginUrl}" class="button">Login Now</a></p>
        <p>If you have any issues logging in, please contact our support team.</p>
        <div class="footer">
           <p>${copyright}</p>
        </div>
    </div>
</body>
</html>
`;
