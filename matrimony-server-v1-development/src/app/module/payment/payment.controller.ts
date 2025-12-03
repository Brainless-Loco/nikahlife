import { Request, Response } from "express";
import { PaymentServices } from "./payment.service";
import mongoose from "mongoose";
import Payment from "./payment.model";
import { sendResponse } from "../../../utils/sendResponse";

export const createPayment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId as string;
    const data = req.body;
    const result = await PaymentServices.createPayment(data, userId);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Payment created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error?.message || "Payment creation failed",
      data: null,
    });
  }
};

export const approvePayment = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;
 

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid payment ID",
        data: null,
      });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Payment not found",
        data: null,
      });
    }

    const result = await PaymentServices.approvePayment(paymentId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment approved and subscription created",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message || "Payment approval failed",
      data: null,
    });
  }
};

export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const result = await PaymentServices.getAllPayments();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All payments retrieved",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message || "Failed to fetch payments",
      data: null,
    });
  }
};
