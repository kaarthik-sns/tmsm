export const replyProfileRequestTemplate = (name: string, homePage: string, content: string, copyright: string): string =>
    `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Profile View Request</title>
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
            <h1>Hello, ${name}!</h1>
            <p>${content}</p>
            
            <p>Click the button below to login</p>
            
            <a href="${homePage}" class="button">Login</a>
            
            <div class="footer">
                <p>${copyright}</p>
            </div>
        </div>
    </body>
    </html>`;
