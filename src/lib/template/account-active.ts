export const accountReactivationTemplate = (name: string, loginUrl: string, email: string, copyright: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Reactivated</title>
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
            color: #333333;
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
        .text-red {
         color: #FF0000;
         }
    </style>
</head>
<body>
    <div class="container">
        <h1>Account Reactivated</h1>
        <p>Hello <span class="highlight">${name}</span>,</p>
        <p>We are pleased to inform you that your TMSM account has been reactivated.</p>
        <p>Click below to access your account:</p>
        <p>
            <a href="${loginUrl}" class="button">
                Login Now
            </a>
        </p>
        <p class="text-red">Note: If you experience any issues logging in, please contact our support team at ${email}.</p>
        <div class="footer">
           <p>${copyright}</p>
        </div>
    </div>
</body>
</html>
`;
