export const deactivateTemplate = (name: string,copyright: string, email: string,): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>We're Sorry to See You Go - TMSM</title>
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
            color: #FF0000;
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
    </style>
</head>
<body>
    <div class="container">
         <h1>Hello ${name},</h1>
            <p>We hope this email finds you well.</p>
            <p>This is to inform you that your matrimony profile on TMSM has been successfully deactivated. As per your request, your profile is no longer visible to other members.
            </p>
            <p> If you would like to activate your profile at any time or have any questions, please feel free to reach out to our support team at ${email}.</p>
            <div class="footer">
            <p>${copyright}</p>
            </div>
    </div>
</body>
</html>`;