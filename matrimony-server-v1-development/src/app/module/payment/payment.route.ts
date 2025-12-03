
import express from "express";
import { USER_ROLE } from "../../../types/global";
import { approvePayment, createPayment, getAllPayments } from "./payment.controller";
import catchAsync from "../../../utils/catchAsync";
import auth from "../../../middlewares/checkAuth";


const router = express.Router();

// Create a payment (User)
router.post("/create", auth(USER_ROLE.USER), catchAsync(createPayment));


// Get all payments (Admin only)
router.get("/all", auth(USER_ROLE.ADMIN), catchAsync(getAllPayments));

// Approve a payment (Admin)
router.patch("/approve/:id", auth(USER_ROLE.ADMIN), catchAsync(approvePayment));

export const paymentRoutes =  router;

