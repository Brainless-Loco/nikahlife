import { Request, Response } from "express";
import { BiodataServices } from "./biodata.service";
import httpStatus from "http-status-codes";
import { ApprovalStatus } from "./biodata.interface";
import { sendResponse } from "../../../utils/sendResponse";
import catchAsync from "../../../utils/catchAsync";

// Create or update own biodata
const createOrUpdateBiodata = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const data = req.body;

  const result = await BiodataServices.createBiodata(data, userId);

  // নতুন token cookie-তে পাঠাও
  res.cookie("token", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Biodata created successfully",
    data: result,
  });

});

// Update own biodata
const updateOwnBiodata = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const updateData = req.body;

  const updatedBiodata = await BiodataServices.updateOwnBiodata(
    userId!,
    updateData
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Biodata updated successfully",
    data: updatedBiodata,
  });
});

// Delete own biodata (soft delete)
// Delete own biodata (move to Trash)
const deleteOwnBiodata = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const trashedBiodata = await BiodataServices.deleteOwnBiodata(userId!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Biodata deleted successfully and moved to Trash",
    data: trashedBiodata,
  });
});

// Get all approved biodata
const getAllBiodata = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const currentUserId = req.user?.userId;

  const result = await BiodataServices.getAllBiodata(filters, currentUserId!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All approved biodata fetched successfully",
    data: result,
  });
});

// Get own biodata
const getOwnBiodata = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await BiodataServices.getOwnBiodata(userId!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your biodata fetched successfully",
    data: result,
  });
});

// Get biodata by ID
const getBiodataById = catchAsync(async (req: Request, res: Response) => {
  const biodataId = req.params.id; 
  const currentUserId = req.user?.userId;

  const result = await BiodataServices.getBiodataById(biodataId, currentUserId!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Biodata fetched successfully",
    data: result,
  });
});

// Approve or reject biodata (admin)
const approveOrRejectBiodata = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  let { status } = req.body;
  status = status.toLowerCase();
  if (!Object.values(ApprovalStatus).includes(status)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid status value",
      data: null,
    });
  }

  const updatedBiodata = await BiodataServices.approveOrRejectBiodata(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Biodata ${status} successfully`,
    data: updatedBiodata,
  });
});

// Get all pending biodata (admin)
const getPendingBiodata = catchAsync(async (req: Request, res: Response) => {
  const result = await BiodataServices.getPendingBiodata();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending biodata fetched successfully",
    data: result,
  });
});
// Admin delete any user's biodata
const adminDeleteBiodata = catchAsync(async (req: Request, res: Response) => {
  const biodataId = req.params.id;

  const trashedBiodata = await BiodataServices.adminDeleteBiodata(biodataId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Biodata deleted by admin successfully",
    data: trashedBiodata,
  });
});

// Admin get all biodata
const getAllBiodataAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await BiodataServices.getAllBiodataAdmin();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All biodata fetched successfully (admin)",
    data: result,
  });
});

export const BiodataControllers = {
  createOrUpdateBiodata,
  updateOwnBiodata,
  deleteOwnBiodata, 
  getAllBiodata,
  getOwnBiodata,
  getBiodataById,
  approveOrRejectBiodata,
  getPendingBiodata,
  adminDeleteBiodata ,
  getAllBiodataAdmin
};
