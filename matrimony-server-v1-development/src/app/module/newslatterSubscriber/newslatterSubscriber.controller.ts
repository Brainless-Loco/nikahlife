import { Request } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { getSubscribers, subscribeUser } from "./newslatterSubscriber.service";
import catchAsync from "../../../utils/catchAsync";


export const subscribe = catchAsync(async (req: Request, res) => {
  const { email } = req.body;


  if (!email) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Email is required",
      data: null,
    });
  }

  const subscriber = await subscribeUser(email);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Subscribed successfully. Thank you email sent.",
    data: subscriber,
  });
});

export const getAllSubscribers = catchAsync(async (req: Request, res) => {
  const subscribers = await getSubscribers()

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subscribers fetched successfully",
    meta: {
      limit: subscribers.length,
      page: 1,
      total: subscribers.length,
      totalPage: 1,
    },
    data: subscribers,
  });
});
