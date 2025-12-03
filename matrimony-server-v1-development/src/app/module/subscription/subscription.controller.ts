import { Request, Response } from "express";
import mongoose from "mongoose";
import { SubscriptionServices } from "./subscription.service";
import { sendResponse } from "../../../utils/sendResponse";
import catchAsync from "../../../utils/catchAsync";
const createSubscription = async (req: Request, res: Response) => {
  try {
    const { type, durationInMonths, profileViewLimit } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user?.userId);

    const subscription = await SubscriptionServices.createSubscription({
      userId,
      subscriptionType: type,
      durationInMonths,
      profileViewLimit,
      status: "inactive",
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message || "Failed to create subscription",
      data: null,
    });
  }
};

const activateSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subscription = await SubscriptionServices.activateSubscription(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Subscription activated successfully",
      data: subscription,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message || "Failed to activate subscription",
      data: null,
    });
  }
};

const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await SubscriptionServices.getAllSubscriptions();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All subscriptions fetched successfully",
      data: subscriptions,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message || "Failed to fetch subscriptions",
      data: [],
    });
  }
};

const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = await SubscriptionServices.getSubscriptionById(id);

    if (!subscription) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Subscription not found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Subscription fetched successfully",
      data: subscription,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message || "Failed to fetch subscription",
      data: null,
    });
  }
};
const expireSubscription = catchAsync(async (req: Request, res: Response) => {
  const id  = req.params.id;
  const subscription = await SubscriptionServices.expireSubscription(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subscription expired successfully",
    data: subscription,
  });
});
export const SubscriptionControllers = {
  createSubscription,
  activateSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  expireSubscription,
};
