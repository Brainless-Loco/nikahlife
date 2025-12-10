import Biodata from "./biodata.model";
import { ApprovalStatus, IBiodata } from "./biodata.interface";
import mongoose from "mongoose";
import User from "../user/user.model";
import { checkHasBiodata, createUserTokens } from "../../../utils/userToken";
import { Ignore } from "../ignoreList/ignoreList.model";
import Trash from "../trash/trash.model";

function generateBiodataNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateString = `${year}${month}${day}`;
  const randomNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  return `BD-${dateString}-${randomNumber}`;
}

const createBiodata = async (data: IBiodata, userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User does not exist. Cannot create biodata.");
  }

  // Check if biodata already exists
  const existingBiodata = await Biodata.findOne({ userId });
  if (existingBiodata) {
    throw new Error("Biodata already exists for this user.");
  }

  // Generate unique biodata number
  const biodataNumber = generateBiodataNumber();

  // Create new biodata
  const biodata = new Biodata({ ...data, userId, biodataNumber });
  await biodata.save();

  // Generate access token
  const { accessToken } = createUserTokens({
    ...user.toObject(),
    hasBiodata: true,
  });
const { valid, hasBiodata, decoded } = checkHasBiodata(accessToken);

  return { 
    biodata, 
    accessToken, 
    tokenValid: valid, 
    hasBiodata, 
    decodedToken: decoded 
  };

};

const updateOwnBiodata = async (
  userId: string,
  updateData: Partial<IBiodata>
) => {
  return await Biodata.findOneAndUpdate(
    { userId,  },
    updateData,
    { new: true }
  );
};

const getAllBiodata = async (filters: any, currentUserId: string) => {
  const conditions: any[] = [];

  conditions.push({ isApproved: ApprovalStatus.APPROVED });


  const ignored = await Ignore.find({ user: currentUserId }).select(
    "ignoredUser"
  );
  const ignoredIds = ignored.map((i) => i.ignoredUser);
  if (ignoredIds.length > 0) {
    conditions.push({ userId: { $nin: ignoredIds } });
  }

    // Name filter
  if (filters.name && filters.name.trim() !== "") {
    conditions.push({ name: { $regex: filters.name, $options: "i" } });
  }

  // Gender filter
  if (filters.gender && filters.gender.trim() !== "") {
    conditions.push({ gender: filters.gender });
  }

// Age range filter (improved)
if (filters.minAge || filters.maxAge) {
  const ageCondition: any = {};
  if (filters.minAge && !isNaN(Number(filters.minAge))) {
    ageCondition.$gte = Number(filters.minAge);
  }
  if (filters.maxAge && !isNaN(Number(filters.maxAge))) {
    ageCondition.$lte = Number(filters.maxAge);
  }
  if (Object.keys(ageCondition).length > 0) {
    conditions.push({ age: ageCondition });
  }
}

// University filter
if (filters.university && filters.university.trim() !== "") {
  conditions.push({
    "education.university": { $regex: filters.university, $options: "i" },
  });
}

  // Address filters
  if (filters.division && filters.division.trim() !== "") {
    conditions.push({ "address.present.division": filters.division });
  }
  if (filters.district && filters.district.trim() !== "") {
    conditions.push({ "address.present.district": filters.district });
  }
  if (filters.upazila && filters.upazila.trim() !== "") {
    conditions.push({ "address.present.upazila": filters.upazila });
  }
  if (filters.country && filters.country.trim() !== "") {
    conditions.push({ "address.present.country": filters.country });
  }

  // Marital status filter
  if (filters.maritalStatus && filters.maritalStatus.trim() !== "") {
    conditions.push({ "maritalInfo.maritalStatus": filters.maritalStatus });
  }

  // Education filter
  if (filters.sscGroup && filters.sscGroup.trim() !== "") {
    conditions.push({ "education.sscGroup": filters.sscGroup });
  }
  if (filters.sscResult && filters.sscResult.trim() !== "") {
    conditions.push({ "education.sscResult": filters.sscResult });
  }
  if (filters.hscGroup && filters.hscGroup.trim() !== "") {
    conditions.push({ "education.hscGroup": filters.hscGroup });
  }
  if (filters.hscResult && filters.hscResult.trim() !== "") {
    conditions.push({ "education.hscResult": filters.hscResult });
  }
  if (filters.honours && filters.honours.trim() !== "") {
    conditions.push({
      "education.honours": { $regex: filters.honours, $options: "i" },
    });
  }

  // Physical info
  if (filters.height && filters.height.trim() !== "") {
    conditions.push({ "physicalInfo.height": filters.height });
  }
  if (filters.bodyColor && filters.bodyColor.trim() !== "") {
    conditions.push({ "physicalInfo.bodyColor": filters.bodyColor });
  }

  // Preference
  if (filters.educationLevel && filters.educationLevel.trim() !== "") {
    conditions.push({ "preference.educationLevel": filters.educationLevel });
  }
  if (filters.religiousPractice && filters.religiousPractice.trim() !== "") {
    conditions.push({
      "preference.religiousPractice": filters.religiousPractice,
    });
  }

  // Generic approach: Add any new field from filters automatically
  Object.keys(filters).forEach((key) => {
    if (
      ![
        "name",
        "gender",
        "minAge",
        "maxAge",
        "division",
        "district",
        "upazila",
        "country",
        "maritalStatus",
        "sscGroup",
        "sscResult",
        "hscGroup",
        "hscResult",
        "honours",
        "height",
        "bodyColor",
        "educationLevel",
        "religiousPractice",
      ].includes(key)
    ) {
      conditions.push({ [key]: { $regex: filters[key], $options: "i" } });
    }
  });

  const query = { $and: conditions };

  const result = await Biodata.find(query).populate(
    "userId",
    "username  "
  );
  return result;
};

const getBiodataById = async (biodataId: string, currentUserId: string) => {
  if (!mongoose.Types.ObjectId.isValid(biodataId)) {
    throw new Error("Invalid biodata ID");
  }

  const biodata = await Biodata.findOne({
    _id: biodataId,
  }).populate("userId", "username ");

  if (!biodata) return null;

  const isIgnored = await Ignore.findOne({
    user: new mongoose.Types.ObjectId(currentUserId),
    ignoredUser: biodata.userId._id,
  });

  if (isIgnored) return null;

  return biodata;
};

const approveOrRejectBiodata = async (id: string, status: ApprovalStatus) => {
  if (![ApprovalStatus.APPROVED, ApprovalStatus.REJECTED].includes(status)) {
    throw new Error("Invalid status. Must be 'approved' or 'rejected'");
  }

  return await Biodata.findByIdAndUpdate(
    id,
    { isApproved: status },
    { new: true }
  );
};

const getPendingBiodata = async () => {
  return await Biodata.find({
    isApproved: ApprovalStatus.PENDING,
  }).populate("userId", "username email role phone");
};

const getOwnBiodata = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  return await Biodata.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).populate("userId", "username email role");
};

const deleteOwnBiodata = async (userId: string) => {


 
  const biodata = await Biodata.findOne({ userId });
  if (!biodata) {
    throw new Error("Biodata not found");
  }


  const trashed = new Trash({
  data: JSON.parse(JSON.stringify(biodata)), 
      deletedAt: new Date(),
  });

  await trashed.save();

  await Biodata.deleteOne({ userId });

  return trashed;
};
// Admin get all biodata (any status)
const getAllBiodataAdmin = async () => {
  return await Biodata.find({}).populate("userId"); // full user document
};
// Admin delete any user's biodata
const adminDeleteBiodata = async (biodataId: string) => {
  const biodata = await Biodata.findById(biodataId);
  if (!biodata) throw new Error("Biodata not found");

  const trashed = new Trash({
    data: JSON.parse(JSON.stringify(biodata)),
    deletedAt: new Date(),
  });
  await trashed.save();

  await Biodata.findByIdAndDelete(biodataId);

  return trashed;
};

export const BiodataServices = {
  createBiodata,
  updateOwnBiodata,
  getAllBiodata,
  getBiodataById,
  approveOrRejectBiodata,
  getPendingBiodata,
  getOwnBiodata,
  deleteOwnBiodata, 
  getAllBiodataAdmin,
  adminDeleteBiodata
};
