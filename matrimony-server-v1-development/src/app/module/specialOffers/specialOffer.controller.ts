import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { SpecialOfferService } from "./specialOffer.service";

const createOffer = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialOfferService.createOffer({
    ...req.body,
    createdBy: req.user?.userId as string, 
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Special offer created successfully",
    data: result,
  });
});

const getAllOffers = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialOfferService.getAllOffers();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Active offers fetched successfully",
    data: result,
  });
});

const deleteOffer = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialOfferService.deleteOffer(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Special offer deleted successfully",
    data: result,
  });
});

export const SpecialOfferController = {
  createOffer,
  getAllOffers,
  deleteOffer,
};
