import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { sendResponse } from "../../../utils/sendResponse";
import catchAsync from "../../../utils/catchAsync";
import { generateOTP } from "../../../utils/generateOTP";
import { sendOtpEmail } from "../../services/emailService";
import { OtpModel } from "../otp/OtpModel";
import User from "./user.model";

// ======================
// Register User
// ======================
const registerUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Email already taken",
        data: null,
      });
    }

    

    const user = await UserServices.registerUserIntoDB({
      ...data,
      isVerified: false,
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully. OTP sent to email.",
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message || "User registration failed",
      data: null,
    });
  }
};

// ======================
// Verify OTP (User Side)
// ======================
const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  // 1. Check OTP from DB
  const existingOtp = await OtpModel.findOne({ email, otp });
  if (!existingOtp) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid or expired OTP",
      data: null,
    });
  }

  // 2. Update user isVerified = true
  const updatedUser = await UserServices.verifyUserByEmail(email);

  // 3. Delete OTP after success
  await OtpModel.deleteOne({ email, otp });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User verified successfully via OTP",
    data: updatedUser,
  });
});

// ======================
// Verify User (Admin Route)
// ======================
const verifyUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  const updatedUser = await UserServices.verifyUser(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User verified successfully by Admin",
    data: updatedUser,
  });
};

// ======================
// Get All Users
// ======================
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserServices.getAllUsers();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
});
const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Email is required",
      data: null,
    });
  }

  // 1. Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
      data: null,
    });
  }

  // 2. Generate new OTP
  const newOtp = generateOTP();

  // 3. Send OTP email
  await sendOtpEmail(email, newOtp);

  // 4. Update OTP in DB (replace old one or create if not exists)
  await OtpModel.findOneAndUpdate(
    { email },
    { otp: newOtp, createdAt: new Date() },
    { upsert: true }
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "New OTP sent successfully",
    data: null,
  });
});
const getOwnUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const user = await UserServices.getOwnUser(userId!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your information fetched successfully",
    data: user,
  });
});

 const updateProfileController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const updateData = req.body;

  const updatedUser = await UserServices.updateUserProfile(userId, updateData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

export const UserControllers = {
  registerUser,
  updateProfileController,
  verifyOtp,   
  verifyUser,  
  getAllUsers,
  resendOtp,
  getOwnUser
};
