import bcrypt from "bcrypt";
import { IUser } from "./user.interface";
import User from "./user.model";
import AppError from "../../../errors/AppError";

const registerUserIntoDB = async (data: Partial<IUser>): Promise<IUser> => {
  const email = data.email?.toLowerCase().trim();
  const hashedPassword = await bcrypt.hash(data.password!, 10);
    const isProfileCompleted = true;

  const user = new User({ ...data, email, password: hashedPassword, isProfileCompleted });
  return await user.save();
};

const loginUserFromDB = async ({
  email,
  password,
}: {
  email?: string;
  password: string;
}) => {
  const normalizedEmail = email?.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) throw new Error("Incorrect Email");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Incorrect Password");

  return user;
};

const verifyUser = async (id: string) => {
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { isVerified: true },
    { new: true }
  );

  return updatedUser;
};

const getAllUsers = async () => {
  return await User.find();
};

const verifyUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  user.isVerified = true;
  await user.save();

  return user;
};
const updateUserProfile = async (userId: string, updateData: Partial<IUser>) => {
  // role skip
  if (updateData.role) delete updateData.role;

  // password hash
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  // profile complete flag
  updateData.isProfileCompleted = true;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password").populate("subscriptionId");

  if (!updatedUser) throw new AppError(404, "User not found");

  return updatedUser;
};

const getOwnUser = async (userId: string) => {
  const user = await User.findById(userId)
    .select("-password") 
    .populate("subscriptionId"); 

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};

export const UserServices = {
  registerUserIntoDB,
  loginUserFromDB,
  verifyUser,
  getAllUsers,
  verifyUserByEmail,
  updateUserProfile,
  getOwnUser, 
};
