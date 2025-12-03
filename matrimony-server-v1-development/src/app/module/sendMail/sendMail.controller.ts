// src/app/modules/mail/mail.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { MailService } from "./sendMail.service";


const sendMailToUser = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.query;
  const senderEmail = req.user?.email as string;
    const senderId = req.user?.userId as string;
  if (!email || typeof email !== "string") {
    throw new Error("Email query parameter is required");
  }

 

  const result = await MailService.sendMailToSingleUser(email, req.body, senderEmail, senderId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Mail sent to user successfully",
    data: result,
  });
});

const sendMailToAll = catchAsync(async (req: Request, res: Response) => {
  const senderEmail = req.user?.email as string;
  const senderId = req.user?.userId as string;

  const result = await MailService.sendMailToAllUsers(req.body, senderEmail, senderId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Mail sent to all verified users successfully",
    data: result,
  });
});

const getAllMails = catchAsync(async (req: Request, res: Response) => {
  const result = await MailService.getAllMails();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Mail list retrieved successfully",
    data: result,
  });
});

export const MailController = {
  sendMailToUser,
  sendMailToAll,
  getAllMails,
};
