import Biodata from "../biodata/biodata.model";
import Subscription from "../subscription/subscription.model";
import User from "../user/user.model";
import ProfileVisit from "./contactVisit.model";
import { Types } from "mongoose";

const viewContactInfo = async (userId: string, profileId: string) => {
  // Step 1: User + subscription check
  const user = await User.findById(userId).populate("subscriptionId");
  if (!user || !user.subscriptionId) {
    return { access: "denied", message: "No active subscription" };
  }

  const subscription: any = user.subscriptionId;

  // Step 1.1: Profile owner info fetch
  const profileOwner = await User.findById(profileId).select("_id name email phone");

  // Step 2: Already viewed check
  let profileVisit = await ProfileVisit.findOne({ userId });
  if (profileVisit?.visitedProfiles?.some((p: any) => p.profileId.toString() === profileId)) {
    return {
      access: "granted",
      pointsDeducted: 0,
      alreadyViewed: true,
      remaining: subscription.profileViewLimit,
      subscriptionStatus: subscription.status,
      currentPackage: subscription.subscriptionType,
      profileOwner: profileOwner
        ? {
            id: profileOwner._id,
            name: profileOwner.name,
            email: profileOwner.email,
            phone: profileOwner.phone,
          }
        : null,
    };
  }

  // Step 3: Limit check
  if ((subscription.profileViewLimit ?? 0) <= 0) {
    return {
      access: "denied",
      message: "Profile view limit exceeded. Please buy points.",
      remaining: 0,
      subscriptionStatus: subscription.status,
      currentPackage: "free",
      profileOwner: profileOwner
        ? {
            id: profileOwner._id,
            name: profileOwner.name,
            email: profileOwner.email,
            phone: profileOwner.phone,
          }
        : null,
    };
  }

  // Step 4: Deduct point from subscription
  const updatedSubscription = await Subscription.findByIdAndUpdate(
    subscription._id,
    { $inc: { profileViewLimit: -1 } },
    { new: true }
  );

  // Step 5: Update ProfileVisit
  if (!profileVisit) {
    profileVisit = await ProfileVisit.create({
      userId,
      visitedProfiles: [
        {
          profileId: new Types.ObjectId(profileId),
          contactViewed: true,
          viewedAt: new Date(),
          email: profileOwner?.email || null,
          phone: profileOwner?.phone || null,
        },
      ],
      totalVisitedCount: 1,
    });
  } else {
    profileVisit.visitedProfiles.push({
      profileId: new Types.ObjectId(profileId),
      contactViewed: true,
      viewedAt: new Date(),
      email: profileOwner?.email as string,
      phone: profileOwner?.phone as string,
    });
    profileVisit.totalVisitedCount = (profileVisit.totalVisitedCount || 0) + 1;
    await profileVisit.save();
  }

  // Step 6: If profileViewLimit is 0, expire subscription & downgrade user
  if ((updatedSubscription?.profileViewLimit ?? 0) <= 0) {
    await Subscription.findByIdAndUpdate(subscription._id, { status: "expired" });
    await User.findByIdAndUpdate(userId, { subscriptionType: "free" });
  }

  // ✅ Response only with profileOwner info
  return {
    access: "granted",
    pointsDeducted: 1,
    remaining: updatedSubscription?.profileViewLimit,
    subscriptionStatus: (updatedSubscription?.profileViewLimit ?? 0) <= 0 ? "expired" : "active",
    currentPackage: (updatedSubscription?.profileViewLimit ?? 0) <= 0 ? "free" : subscription.subscriptionType,
    profileOwner: profileOwner
      ? {
          id: profileOwner._id,
          name: profileOwner.name,
          email: profileOwner.email,
          phone: profileOwner.phone,
        }
      : null,
  };
};

const getProfileViewStatus = async (userId: string) => {
  const user = await User.findById(userId).populate("subscriptionId");
  if (!user) throw new Error("User not found");

  const subscription: any = user.subscriptionId;

  // Step 1: Find ProfileVisit for this user
  const profileVisit = await ProfileVisit.findOne({ userId });

  const totalViewed = profileVisit?.totalVisitedCount || 0;
  const remaining = subscription ? subscription.profileViewLimit : 0;

  // Step 2: For each visited profile, fetch the owner biodata
  const visitedProfiles = await Promise.all(
    (profileVisit?.visitedProfiles || []).map(async (vp: any) => {
      // vp.profileId is actually the userId of the visited profile owner
      const biodata = await Biodata.findOne({ userId: vp.profileId });
      return {
        profileId: vp.profileId,
        biodata: biodata || null,
        email: vp.email || null,
        phone: vp.phone || null,
        contactViewed: vp.contactViewed,
        viewedAt: vp.viewedAt,
      };
    })
  );

  return {
    totalViewed,
    remaining,
    package: subscription?.subscriptionType || "free",
    visitedProfiles,
  };
};



export const ProfileVisitService = { viewContactInfo, getProfileViewStatus };
