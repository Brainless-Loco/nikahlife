import { IShortlist } from "./shortList.interface";
import { Shortlist } from "./shortList.model";


// Add shortlist
const addShortlist = async (userId: string, biodataId: string): Promise<IShortlist> => {
  const shortlist = await Shortlist.create({ userId, biodataId });
  return shortlist;
};

// Get all shortlists for a user with populated biodata
const getUserShortlists = async (userId: string) => {
  return await Shortlist.find({ userId }).populate("biodataId");
};

export const ShortlistService = {
  addShortlist,
  getUserShortlists,
};
