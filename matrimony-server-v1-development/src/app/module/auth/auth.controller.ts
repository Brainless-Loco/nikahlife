import { sendResponse } from "../../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import { setAuthCookie } from "../../../utils/setCookie";
import { UserServices } from "../user/user.service";
import { BiodataServices } from "../biodata/biodata.service";
import Payment from "../payment/payment.model";
import jwt from "jsonwebtoken";
import catchAsync from "../../../utils/catchAsync";
import { AuthServices } from "./auth.service";

import { envVars } from "../../../config/envConfig";
import { AuthUser } from "../user/user.interface";
import User from "../user/user.model";
import authLogger from "../../../utils/logger";


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Email and password required",
        data: null,
      });
    }

    const user = await UserServices.loginUserFromDB({ email, password });
const userId = user.userId || user._id.toString();
    const hasBiodata = !!(await BiodataServices.getOwnBiodata(userId));

    const latestPayment = await Payment.findOne({ userId })
      .sort({ paymentDate: -1 })
      .lean();

    const subscriptionType = latestPayment?.subscriptionType || "free";


    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        hasBiodata,
        subscriptionType, 
      },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" }
    );


 res.cookie("token", accessToken, {
        httpOnly: true,
        secure: true, // Production এ অবশ্যই true (HTTPS লাগবে)
        sameSite: "none", // Cross-origin এর জন্য
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        hasBiodata,
        subscriptionType,
        token: accessToken,
      },
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: error.message || "Login failed",
      data: null,
    });
  }
};

// Logout
export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logout successful",
    data: null,
  });
};

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  const result = await AuthServices.resetPassword(email, newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});


// export const googleCallbackController = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userFromPassport = req.user as AuthUser;

//       if (!userFromPassport) {
//         return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
//       }

//       // DB থেকে fetch করা
//       const user = await User.findById(userFromPassport.userId).lean();

//       if (!user) {
//         return res.redirect(`${envVars.FRONTEND_URL}/login?error=user_not_found`);
//       }

//       // JWT create করো যদি চাও
//       const token = jwt.sign(
//         {
//           userId: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           gender: user.gender,
//           role: user.role || "user",
//           hasBiodata: user.hasBiodata || false,
//           subscriptionType: user.subscriptionType || "free",
//         },
//         process.env.JWT_SECRET || "defaultsecret",
//         { expiresIn: "7d" }
//       );

//       // cookie set
//       res.cookie("token", token, {
// httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//   maxAge: 7 * 24 * 60 * 60 * 1000,
//   path: "/",
 
// });

//       // profile check
//       if (!user.isProfileCompleted) {
//         return res.redirect(`${process.env.FRONTEND_URL}/profile-complete`);
//       }

//       // normal redirect
//     res.redirect(`${envVars.FRONTEND_URL}`);


//     } catch (error) {
//       console.error("❌ Google callback error:", error);
//       res.redirect(`${envVars.FRONTEND_URL}/login?error=server_error`);
//     }
//   }
// );



export const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    authLogger.start('googleCallbackController', 'Processing Google OAuth callback');
    
    try {
      const userFromPassport = req.user as AuthUser & { isNewUser?: boolean };
      
      if (!userFromPassport) {
        authLogger.error('googleCallbackController', 'No user data received from passport', { reqUser: req.user });
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
      }
      
      authLogger.info('googleCallbackController', 'User data received from passport', {
        userId: userFromPassport.userId,
        email: userFromPassport.email,
        isNewUser: userFromPassport.isNewUser,
        hasBiodata: userFromPassport.hasBiodata,
        subscriptionType: userFromPassport.subscriptionType
      });

      authLogger.debug('googleCallbackController', 'Fetching fresh user data from database');
      const user = await User.findById(userFromPassport.userId).lean();
      
      if (!user) {
        authLogger.error('googleCallbackController', 'User not found in database', { userId: userFromPassport.userId });
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=user_not_found`);
      }
      
      authLogger.info('googleCallbackController', 'User found in database', {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        isProfileCompleted: user.isProfileCompleted
      });

      // Use the enriched data from passport (hasBiodata, subscriptionType already fetched)
      authLogger.debug('googleCallbackController', 'Creating JWT token');
      
      const tokenPayload = {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role || "user",
        hasBiodata: userFromPassport.hasBiodata || false,
        subscriptionType: userFromPassport.subscriptionType || "free",
        isVerified: true, // Google users are always verified
      };
      
      authLogger.debug('googleCallbackController', 'JWT payload prepared', tokenPayload);
      
      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || "defaultsecret",
        { expiresIn: "7d" }
      );
      
      authLogger.success('googleCallbackController', 'JWT token created successfully', {
        tokenLength: token.length,
        expiresIn: '7d'
      });

      // Prepare user data for cookie (non-httpOnly for client access)
      const userDataForCookie = {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role || "user",
        hasBiodata: userFromPassport.hasBiodata || false,
        subscriptionType: userFromPassport.subscriptionType || "free",
      };
      const userData = JSON.stringify(userDataForCookie);
      
      authLogger.debug('googleCallbackController', 'User data for cookie prepared', userDataForCookie);

      // Cookie settings - must be readable by client JS and work cross-origin
      // For localhost development, secure should be false, sameSite lax
      // For production (HTTPS), secure true, sameSite none
      const isProduction = process.env.NODE_ENV === 'production';
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      const cookieOptions = {
        httpOnly: false, // Must be false so client JS can read it
        secure: isProduction, // true for HTTPS (production), false for HTTP (localhost)
        sameSite: isProduction ? "none" as const : "lax" as const,
        maxAge,
        path: "/",
        domain: isProduction ? ".nikahlife.com" : undefined,
      };
      
      authLogger.debug('googleCallbackController', 'Cookie options', { ...cookieOptions, isProduction });

      // Set token cookie (readable by client)
      res.cookie("token", token, cookieOptions);
      authLogger.info('googleCallbackController', 'Token cookie set successfully');
      
      // Set user data cookie
      res.cookie("user", userData, cookieOptions);
      authLogger.info('googleCallbackController', 'User data cookie set successfully');
      
      // Set additional cookies to match manual login
      res.cookie("userRole", userDataForCookie.role, cookieOptions);
      res.cookie("hasBiodata", userDataForCookie.hasBiodata ? "true" : "false", cookieOptions);
      res.cookie("subscriptionType", userDataForCookie.subscriptionType, cookieOptions);

      // Redirect logic - pass token in URL for cross-origin cookie handling
      const isNewUser = userFromPassport.isNewUser;
      const frontendUrl = envVars.FRONTEND_URL;
      
      authLogger.debug('googleCallbackController', 'Determining redirect destination', {
        isNewUser,
        isProfileCompleted: user.isProfileCompleted,
        frontendUrl
      });

      // Encode user data for URL
      const encodedUserData = encodeURIComponent(userData);
      const authParams = `token=${encodeURIComponent(token)}&user=${encodedUserData}`;

      if (isNewUser || !user.isProfileCompleted) {
        // New users or incomplete profiles go to dashboard to complete profile
        const redirectUrl = `${frontendUrl}/api/auth/google/callback?${authParams}&redirect=/dashboard?welcome=true`;
        authLogger.success('googleCallbackController', 'Redirecting new/incomplete user to dashboard', { redirectUrl: redirectUrl.substring(0, 100) + '...' });
        return res.redirect(redirectUrl);
      }

      // Existing users go to home
      const redirectUrl = `${frontendUrl}/api/auth/google/callback?${authParams}&redirect=/`;
      authLogger.success('googleCallbackController', 'Redirecting existing user to home', { redirectUrl: redirectUrl.substring(0, 100) + '...' });
      res.redirect(redirectUrl);
      
    } catch (error) {
      authLogger.error('googleCallbackController', 'Error processing Google callback', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      console.error("❌ Google callback error:", error);
      res.redirect(`${envVars.FRONTEND_URL}/login?error=server_error`);
    }
  }
);