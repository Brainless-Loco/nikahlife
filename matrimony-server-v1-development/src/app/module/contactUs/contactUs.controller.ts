import { Request, Response } from "express";

import nodemailer from "nodemailer";
import catchAsync from "../../../utils/catchAsync";
import { ContactService } from "./contactUs.service";
import { sendResponse } from "../../../utils/sendResponse";
import { emailTemplate } from "./contactUs.emailTamplate";

const sendContactMessage = catchAsync(async (req: Request, res: Response) => {
  const { email, subject, body } = req.body;

  // 1. Save to DB
  const result = await ContactService.createContact({ email, subject, body });

  // 2. Forward mail to admin
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: email,
    to: process.env.SMTP_USER,
    subject: `Contact Form: ${subject}`,
     html: emailTemplate(email, subject, body),
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Message sent & saved successfully",
    data: result,
  });
});

export const ContactController = {
  sendContactMessage,
};
