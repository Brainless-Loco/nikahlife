import express from "express";
import { ReviewController } from "./review.controller";
import checkAuth from "../../../middlewares/checkAuth";
import { USER_ROLE } from "../../../types/global";

const router = express.Router();


router.post("/", checkAuth(USER_ROLE.USER), ReviewController.createReview);
router.get("/my-review", checkAuth(USER_ROLE.USER), ReviewController.getSingleUserReview);


router.get("/", ReviewController.getAllReviews);

router.get("/pending", checkAuth(USER_ROLE.ADMIN), ReviewController.getPendingReviews);
router.put("/approve/:reviewId", checkAuth(USER_ROLE.ADMIN), ReviewController.approveReview);
router.put("/update/:reviewId", checkAuth(USER_ROLE.USER), ReviewController.updateReview);

router.get("/:reviewId", ReviewController.getSingleReview);
router.delete("/delete/:reviewId", checkAuth(USER_ROLE.USER), ReviewController.deleteReview);


export  const ReviewRoutes = router;