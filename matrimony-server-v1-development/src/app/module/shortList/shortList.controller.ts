import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { ShortlistService } from "./shortList.service";
import { Shortlist } from "./shortList.model";


const addShortlist = catchAsync(async (req:Request, res:Response) => {
  const userId = req.user?.userId as string;
  const biodataId = req.params.id;
  const exists = await Shortlist.findOne({ userId, biodataId });
  if (exists) {
    throw new Error("You have already shortlisted this biodata");
  }

  const result = await ShortlistService.addShortlist(userId, biodataId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Biodata added to shortlist successfully",
    data: result,
  });
});

const getUserShortlists = catchAsync(async (req:Request, res:Response) => {
  const userId = req.user?.userId as string;

  const result = await ShortlistService.getUserShortlists(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Shortlists retrieved successfully",
    data: result,
  });
});

export const ShortlistController = {
  addShortlist,
  getUserShortlists,
};
