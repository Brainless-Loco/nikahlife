import { Request, Response } from "express";
import { InterestServices } from "./interest.service";
import Subscription from "../subscription/subscription.model";
import { sendResponse } from "../../../utils/sendResponse";

const sendInterest = async (req: Request, res: Response) => {
  try {
    const senderId = req.user?.userId;
    if (!senderId) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized: userId missing",
        data: null,
      });
    }

    const  receiverId  = req.query.receiverId as string;
    if (!receiverId) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "receiverId is required",
        data: null,
      });
    }

    // Subscription check
    const activeSub = await Subscription.findOne({ userId: senderId, status: "active" });
    if (!activeSub) {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Active subscription required",
        data: null,
      });
    }

    const interest = await InterestServices.sendInterest(senderId, receiverId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Interest sent",
      data: interest,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const cancelInterest = async (req: Request, res: Response) => {
  try {
    const senderId = req.user?.userId;
    if (!senderId) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized: userId missing",
        data: null,
      });
    }

    const { receiverId } = req.params;
    const result = await InterestServices.cancelInterest(senderId, receiverId);

    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "No active interest found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Interest cancelled",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getSentInterests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized: userId missing",
        data: null,
      });
    }

    const interests = await InterestServices.getSentInterests(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Sent interests fetched",
      data: interests,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getReceivedInterests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized: userId missing",
        data: null,
      });
    }

    const interests = await InterestServices.getReceivedInterests(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Received interests fetched",
      data: interests,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const InterestControllers = {
  sendInterest,
  cancelInterest,
  getSentInterests,
  getReceivedInterests,
};
