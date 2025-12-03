import { Schema, model, Types } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    biodataId: { type: Schema.Types.ObjectId, ref: "Biodata", required: true },
    rating: { type: Number, required: true }, // 1-5 rating
    comment: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review = model<IReview>("Review", reviewSchema);
export default Review;
