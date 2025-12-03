import Review from "./review.model";
import { IReview } from "./review.interface";

// create review
const createReview = async (data: IReview) => {
  return await Review.create(data);
};

// get all approved reviews
const getAllReviews = async () => {
  return await Review.find({ status: "approved", isDeleted: false })
    .sort({ createdAt: -1 })
    .populate("userId", "username email gender")
    .populate("biodataId", "name age gender");
};

// get pending reviews
const getPendingReviews = async () => {
  return await Review.find({ status: "pending", isDeleted: false })
    .sort({ createdAt: -1 })
    .populate("userId", "username email gender")
    .populate("biodataId", "name age gender");
};

// get single user reviews
const getSingleUserReview = async (userId: string) => {
  return await Review.find({ userId, isDeleted: false })
    .populate("biodataId", "name age gender")
    .sort({ createdAt: -1 });
};

// get single review by id
const getSingleReview = async (reviewId: string) => {
  return await Review.findOne({ _id: reviewId, isDeleted: false })
    .populate("userId", "username email gender")
    .populate("biodataId", "name age gender");
};

// update review
const updateReview = async (reviewId: string, updateData: Partial<IReview>) => {
  return await Review.findByIdAndUpdate(reviewId, updateData, { new: true });
};

// approve review (admin)
const approveReview = async (reviewId: string) => {
  return await Review.findByIdAndUpdate(reviewId, { status: "approved" }, { new: true });
};

// delete review (soft delete)
const deleteReview = async (reviewId: string) => {
  return await Review.findByIdAndUpdate(reviewId, { isDeleted: true }, { new: true });
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getPendingReviews,
  getSingleUserReview,
  getSingleReview,
  updateReview,
  approveReview,
  deleteReview,
};
