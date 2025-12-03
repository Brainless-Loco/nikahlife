import httpStatus from "http-status-codes";
import { generateToken, verifyToken } from "./jwt";
import { envVars } from "../config/envConfig";
import { IUser } from "../app/module/user/user.interface";
import User from "../app/module/user/user.model";
import AppError from "../errors/AppError";

export const createUserTokens = (user: Partial<IUser>) => {

  const jwtPayload = {
    userId: user._id ? user._id.toString() : '', 
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_SECRET_EXPIRED
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verified = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET);

  if (typeof verified === "string") {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid refresh token");
  }

  const verifiedToken = verified as {
    userId: string;
    email: string;
    role: string;
  };

  const isUserExist = await User.findOne({ email: verifiedToken.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  if (!isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
  }

  const jwtPayload = {
    userId: isUserExist._id ? isUserExist._id.toString() : '', // Convert ObjectId to string
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return {
    accessToken,
  };
};
import jwt from "jsonwebtoken";

export const checkHasBiodata = (token: string) => {
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    return { valid: true, hasBiodata: decoded?.hasBiodata === true, decoded };
  } catch (error) {
    return { valid: false, hasBiodata: false, decoded: null };
  }
};
