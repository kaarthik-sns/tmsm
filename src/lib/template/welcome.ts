export const welcomeTemplate = (userName: string,copyright: string): string =>
`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to TMSM</title>
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
            color: #d09f0f;
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
        <h1>Welcome, ${userName}!</h1>
        <p>Thank you for joining TMSM, the trusted matrimony platform. We are thrilled to have you as a part of our community!</p>
        <p>We wish you all the best in your journey to find your perfect match.</p>
        <div class="footer">
            <p>${copyright}</p>
        </div>
    </div>
</body>
</html>`