import { Types } from "mongoose";

export interface IReview {
  userId: Types.ObjectId | string;
  biodataId: Types.ObjectId | string;
  rating: number;
  comment: string;
  status?: "pending" | "approved";
  isDeleted?: boolean;
}
