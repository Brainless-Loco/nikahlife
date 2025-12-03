import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { ProfileVisitService } from "./contactVisit.service";
import { sendResponse } from "../../../utils/sendResponse";

// ✅ POST API: View contact info
const viewContactInfo = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const { profileId } = req.params;

  const result = await ProfileVisitService.viewContactInfo(userId, profileId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Profile visit information retrieved successfully",
    data: result,
  });
});

// ✅ GET API: Profile view status
const getProfileViewStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const result = await ProfileVisitService.getProfileViewStatus(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile view status retrieved successfully",
    data: result,
  });
});



export const ProfileVisitController = { viewContactInfo, getProfileViewStatus,  };
