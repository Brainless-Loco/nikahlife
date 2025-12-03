export const thankYouTemplate = (email: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thank You for Subscribing</title>
</head>
<body style="margin:0; padding:0; background:#f9fafb; font-family:Arial, sans-serif;">

  <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f9fafb">
    <tr>
      <td align="center" style="padding:30px 15px;">

        <table width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" 
               style="border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td bgcolor="#064e3b" align="center" style="padding:20px;">
              <h1 style="margin:0; font-size:20px; color:#ffffff; font-weight:600;">
                Nikah Matrimony
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:30px; text-align:center;">
              <h2 style="margin-top:0; font-size:18px; color:#064e3b;">You're Subscribed 🎉</h2>
              <p style="font-size:15px; line-height:1.6; color:#374151;">
                Hello <b>${email}</b>,<br/><br/>
                Thank you for subscribing to our newsletter.<br/>
                You'll now receive updates and news directly in your inbox.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#f9fafb" style="padding:18px; text-align:center; font-size:12px; color:#6b7280; border-top:1px solid #e5e7eb;">
              <p style="margin:0;">© ${new Date().getFullYear()} Nikah Matrimony. All Rights Reserved.</p>
              <p style="margin:0;">This is an automated email, please do not reply.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;
