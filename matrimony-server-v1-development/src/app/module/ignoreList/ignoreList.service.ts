// ignore.service.ts

import { Ignore } from "./ignoreList.model";

const ignoreUser = async (userId: string, ignoredUserId: string) => {
  if (userId === ignoredUserId) {
    throw new Error("You cannot ignore yourself");
  }


  const existing = await Ignore.findOne({ user: userId, ignoredUser: ignoredUserId });
  if (existing) {
    throw new Error("You have already ignored this user");
  }

 
  const newIgnore = await Ignore.create({
    user: userId,
    ignoredUser: ignoredUserId,
  });

  return newIgnore;
};


const unignoreUser = async (userId: string, ignoredUserId: string) => {
  return await Ignore.findOneAndDelete({ user: userId, ignoredUser: ignoredUserId });
};

const getIgnoredUsers = async (userId: string) => {
  return await Ignore.find({ user: userId }).populate("ignoredUser", "username email");
};

const isIgnored = async (userId: string, targetUserId: string) => {
  return await Ignore.findOne({ user: userId, ignoredUser: targetUserId });
};

export const IgnoreService = {
  ignoreUser,
  unignoreUser,
  getIgnoredUsers,
  isIgnored,
};
