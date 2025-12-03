import bcryptjs from "bcryptjs";
import User from "../user/user.model";
import AppError from "../../../errors/AppError";
import httpStatus from "http-status";

 const resetPassword = async (email: string, newPassword: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");


  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return { message: "Password reset successfully" };
};
    export const AuthServices = {
  resetPassword
};