import Subscription from "./subscription.model";
import { ISubscription } from "./subscription.interface";
import User from "../user/user.model"; // user model path adjust করো তোমার structure অনুযায়ী

const createSubscription = async (data: Partial<ISubscription>): Promise<ISubscription> => {
  const subscription = new Subscription({
    ...data,
    profileViewLimit: data.profileViewLimit ?? 0,
  });
  return await subscription.save();
};

const activateSubscription = async (id: string) => {
  const sub = await Subscription.findById(id);
  if (!sub) throw new Error("Subscription not found");

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + sub.durationInMonths);

  sub.startDate = startDate;
  sub.endDate = endDate;
  sub.status = "active";

  // determine default limit if not already set
  if (!sub.profileViewLimit || sub.profileViewLimit === 0) {
    if (sub.subscriptionType === "premium") sub.profileViewLimit = 100;
    else if (sub.subscriptionType === "vip") sub.profileViewLimit = 10000;
    else sub.profileViewLimit = 0;
  }

  await sub.save();

  // update user accordingly
  const updateFields: any = {
    subscriptionType: sub.subscriptionType,
    subscriptionStatus: sub.status,
    profileViewLimit: sub.profileViewLimit,
  };

  if (sub.subscriptionType === "premium") {
    updateFields.subscriberPremium = true;
  } else if (sub.subscriptionType === "vip") {
    updateFields.subscriberVIP = true;
  }

  await User.findByIdAndUpdate(sub.userId, updateFields);

  return sub;
};

const expireSubscription = async (id: string) => {
  const sub = await Subscription.findByIdAndUpdate(
    id,
    { status: "expired" },
    { new: true }
  );

  if (!sub) throw new Error("Subscription not found");

  return sub;
};

const getUserSubscription = async (userId: string) => {
  return await Subscription.findOne({ userId, status: "active" });
};

const getAllSubscriptions = async () => {
  return await Subscription.find().populate("userId", "username email role");
};

const getSubscriptionById = async (id: string) => {
  return await Subscription.findById(id).populate("userId", "username email role");
};

export const SubscriptionServices = {
  createSubscription,
  activateSubscription,
  expireSubscription,
  getUserSubscription,
  getAllSubscriptions,
  getSubscriptionById,
};
