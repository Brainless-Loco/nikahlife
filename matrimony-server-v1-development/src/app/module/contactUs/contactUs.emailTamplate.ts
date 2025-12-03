export const emailTemplate = (from: string, subject: string, body: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>New Contact Message</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f7f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #006a4e; /* bottle green */
        padding: 20px;
        text-align: center;
        color: #ffffff;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
      }
      .content {
        padding: 25px;
        color: #333333;
      }
      .content h2 {
        margin-top: 0;
        color: #006a4e;
        font-size: 18px;
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 8px;
      }
      .content p {
        line-height: 1.6;
        margin: 10px 0;
      }
      .footer {
        background-color: #f1f1f1;
        padding: 15px;
        text-align: center;
        font-size: 13px;
        color: #777777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📩 New Contact Message</h1>
      </div>
      <div class="content">
        <h2>Message Details</h2>
        <p><strong>From:</strong> ${from}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${body}</p>
      </div>
      <div class="footer">
        <p>This message was sent via <strong>Contact Us</strong> form.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};
