import { Types } from "mongoose";

export interface IShortlist {
  userId: Types.ObjectId;
  biodataId: Types.ObjectId;
  createdAt?: Date;
}
