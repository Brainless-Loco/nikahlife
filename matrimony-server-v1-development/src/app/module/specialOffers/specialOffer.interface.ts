import { Types } from "mongoose";

export interface ISpecialOffer {
  title: string;
  description: string;
  validTill: Date;
  createdBy: Types.ObjectId;
  isActive: boolean;
}
