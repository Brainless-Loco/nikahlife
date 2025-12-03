import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { sendResponse } from "../../../utils/sendResponse";
import catchAsync from "../../../utils/catchAsync";
import AppError from "../../../errors/AppError";
import Biodata from "../biodata/biodata.model";

export const ReviewController = {
  createReview: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const biodata = await Biodata.findOne({ userId });
    if (!biodata) throw new AppError(404, "Biodata not found for this user");

 
    const data = { ...req.body, userId, biodataId: biodata?._id };
    const review = await ReviewService.createReview(data);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  }),

  getAllReviews: catchAsync(async (req: Request, res: Response) => {
    const reviews = await ReviewService.getAllReviews();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Approved reviews fetched successfully",
      data: reviews,
    });
  }),

  getPendingReviews: catchAsync(async (req: Request, res: Response) => {
    const reviews = await ReviewService.getPendingReviews();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Pending reviews fetched successfully",
      data: reviews,
    });
  }),

  getSingleReview: catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const review = await ReviewService.getSingleReview(reviewId);
    if (!review) throw new AppError(404, "Review not found");

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review fetched successfully",
      data: review,
    });
  }),

  getSingleUserReview: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const review = await ReviewService.getSingleUserReview(userId);
    if (!review) throw new AppError(404, "Review not found");

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User's review fetched successfully",
      data: review,
    });
  }),

  updateReview: catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const review = await ReviewService.updateReview(reviewId, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  }),
  approveReview: catchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const review = await ReviewService.approveReview(reviewId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review approved successfully",
    data: review,
  });
}),

  deleteReview: catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const review = await ReviewService.deleteReview(reviewId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review deleted successfully",
      data: review,
    });
  }),
};
