import express from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../../middlewares/validateRequest";
import catchAsync from "../../../utils/catchAsync";
import checkAuth from "../../../middlewares/checkAuth";
import { USER_ROLE } from "../../../types/global";


const router = express.Router();
router.post("/register",  catchAsync(UserControllers.registerUser));
router.get("/all",checkAuth(USER_ROLE.ADMIN),UserControllers.getAllUsers);
router.post("/verify-otp", UserControllers.verifyOtp);
router.get("/ownProfile",checkAuth(USER_ROLE.USER),UserControllers.getOwnUser)
router.patch("/profile/:userId", UserControllers.updateProfileController);

router.post("/resend-otp", UserControllers.resendOtp) 
router.patch("/:id/verify", catchAsync(UserControllers.verifyUser));



export const UserRoutes = router;

