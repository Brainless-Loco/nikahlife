import AppError from "../../../errors/AppError";

import { ISpecialOffer } from "./specialOffer.interface";
import { SpecialOffer } from "./specialOffers.model";

const createOffer = async (payload: ISpecialOffer) => {
  return await SpecialOffer.create(payload);
};

const getAllOffers = async () => {
  return await SpecialOffer.find({ isActive: true }).sort({ createdAt: -1 });
};

const deleteOffer = async (id: string) => {
  const offer = await SpecialOffer.findById(id);
  if (!offer) {
    throw new AppError(404, "Offer not found");
  }
  offer.isActive = false; 
  await offer.save();
  return offer;
};

export const SpecialOfferService = {
  createOffer,
  getAllOffers,
  deleteOffer,
};
