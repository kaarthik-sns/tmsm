export const deactivateTemplate = (name: string,copyright: string): string => `
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
        <h1>We're Sorry to See You Go, ${name}!</h1>
        <p>We're reaching out to confirm that your account has been deactivated. We're sorry to see you leave, but we respect your decision.</p>
        <p>If this was done by mistake or if you wish to reactivate your account, please don't hesitate to reach out to our support team. We'd be more than happy to assist you in restoring your account.</p>
        <p>If you have any feedback about your experience, please feel free to share it with us. We strive to improve and provide a better experience for our users.</p>
        <p>Thank you for being a part of TMSM. We wish you all the best in your future endeavors.</p>
        <div class="footer">
           <p>${copyright}</p>
        </div>
    </div>
</body>
</html>`;