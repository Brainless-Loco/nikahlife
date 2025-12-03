// ignore.controller.ts
import { Request, Response } from "express";

import { IgnoreService } from "./ignoreList.service";
import { sendResponse } from "../../../utils/sendResponse";

const ignoreUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId as string;
    const ignoredUserId = req.query.ignoredUserId as string;

    const result = await IgnoreService.ignoreUser(userId, ignoredUserId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User ignored successfully",
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

const unignoreUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId as string;
    const ignoredUserId = req.query.ignoredUserId as string;

    const result = await IgnoreService.unignoreUser(userId, ignoredUserId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User unignored successfully",
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

const getIgnoredUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId as string;

    const result = await IgnoreService.getIgnoredUsers(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Ignored users fetched successfully",
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

export const IgnoreController = {
  ignoreUser,
  unignoreUser,
  getIgnoredUsers,
};
