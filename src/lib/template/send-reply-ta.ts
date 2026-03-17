export const sendReplyTa = (
  name: string,
  message: string,
  copyright: string
): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>உங்கள் தொடர்புக்கு பதில்</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Noto Sans', sans-serif; color: #333333;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
    <tr>
      <td align="center" style="padding: 30px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width: 600px; background-color: #FFF7E7; padding: 25px; border-radius: 10px; border: 2px solid #FFF7E7;">
          <tr>
            <td align="center" style="text-align: center; margin-bottom: 20px;">
              <img src="cid:mail_logo" alt="TMSM Logo" style="max-width: 500px; display: block; margin: 0 auto;">
            </td>
          </tr>
          <tr>
            <td align="left" style="padding-top: 20px;">
              <h1 style="color: #6f9c5d; font-size: 18px; font-weight: 700; margin-top: 2em; font-family: 'Noto Sans', sans-serif;">உங்கள் தொடர்புக்கு நன்றி!</h1>
              <h2 style="color: #000000; font-size: 15px; font-weight: 400; margin-top: 1em; font-family: 'Noto Sans', sans-serif;">அன்பான ${name},</h2>
              <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;">நீங்கள் எங்களை தொடர்பு கொண்டதற்கு நன்றி. உங்கள் செய்தியை பெற்றோம்.</p>
              <p style="color: #000000; line-height: 1.8; font-size: 14px; font-family: 'Noto Sans', sans-serif;">இது உங்கள் கேள்விக்கு எங்களுடைய பதில்:</p>

              <div style="background-color: #fff3d4; padding: 15px; border-radius: 8px; margin-top: 20px; font-style: italic; color: #000000; font-family: 'Noto Sans', sans-serif; font-size: 14px; line-height: 1.8;">
                ${message}
              </div>

              <p style="margin-top: 30px; font-size: 12px; color: #000000; font-family: 'Noto Sans', sans-serif;">
                <i>நன்றி மற்றும் வாழ்த்துகள்,<br>
                <span style="color: #000000; font-size: 12px;">TMSM Hub குழுவினர்</span></i>
              </p>

              <p align="center" style="text-align: center; font-size: 12px; color: #000000; margin-top: 20px; font-family: 'Noto Sans', sans-serif;">
                <i>${copyright}</i>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
