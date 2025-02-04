export const adminWelcomeTemplate = (email: string, name: string, phonenumber: string, copyright: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New User Registration</title>
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
        ul {
            list-style:none
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>New User Registration</h1>
        <p>Hello Admin,</p>
        <p>A new user has just registered on TMSM:</p>
        <ul>
            <li><strong>Username:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone Number:</strong> ${phonenumber}</li>
        </ul>
        <p>Please take the necessary actions if required.</p>
        <div class="footer">
           <p>${copyright}</p>
        </div>
    </div>
</body>
</html>`
