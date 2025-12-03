// src/app/modules/mail/mail.service.ts
import { transporter } from "../../../config/mailer";
import AppError from "../../../errors/AppError";
import User from "../user/user.model";
import { IMailPayload } from "./sendMail.interface";
import { Mail } from "./sendMail.model";

const sendMail = async (
  emails: string[],
  payload: IMailPayload,
  senderEmail: string,
  senderId: string
) => {
  const { subject, body } = payload;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails,
    subject,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${subject}</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif; color:#333;">

      <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f4f6f8">
        <tr>
          <td align="center" style="padding:30px 15px;">

            <!-- Main Container -->
            <table width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" 
                   style="border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;">
              
              <!-- Header -->
              <tr>
                <td bgcolor="#064e3b" align="center" style="padding:20px;">
                  <h1 style="margin:0; font-size:20px; color:#ffffff; font-weight:600;">
                    Nikah Matrimony — Admin Notification
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding:30px;">
                  <h2 style="margin-top:0; font-size:18px; color:#064e3b;">${subject}</h2>
                  <p style="font-size:15px; line-height:1.6; color:#374151;">
                    ${body}
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td bgcolor="#f9fafb" style="padding:18px; text-align:center; font-size:13px; color:#6b7280; border-top:1px solid #e5e7eb;">
                  <p style="margin:0;">© ${new Date().getFullYear()} Nikah Matrimony. All Rights Reserved.</p>
                  <p style="margin:4px 0;">This email was sent from the Admin Panel. Please do not reply.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  };

  await transporter.sendMail(mailOptions);

  await Mail.create({
    subject,
    body,
    senderEmail,
    senderId,
    recipients: emails,
  });

  return { success: true, senderEmail, recipients: emails };
};


const sendMailToSingleUser = async (
  email: string,
  payload: IMailPayload,
  senderEmail: string,
  senderId: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "Verified user not found");
  }

  return await sendMail([email], payload, senderEmail, senderId);
};

const sendMailToAllUsers = async (
  payload: IMailPayload,
  senderEmail: string,
  senderId: string
) => {
  const users = await User.find({ isVerified: true }).select("email");

  const emails = users.map((u) => u.email);
  if (emails.length === 0) {
    throw new AppError(404, "No verified users found");
  }

  return await sendMail(emails, payload, senderEmail, senderId);
};

const getAllMails = async () => {
  return await Mail.find()
    .populate("senderId", "name email")
    .sort({ createdAt: -1 });
};

export const MailService = {
  sendMailToSingleUser,
  sendMailToAllUsers,
  getAllMails,
};
