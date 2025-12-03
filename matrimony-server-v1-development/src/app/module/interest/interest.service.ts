import Interest from "./interest.model";
import { IInterest } from "./interest.interface";
import Biodata from "../biodata/biodata.model";

const sendInterest = async (senderId: string, receiverId: string): Promise<IInterest> => {
  const existing = await Interest.findOne({ sender: senderId, receiver: receiverId, status: "sent" });
  if (existing) throw new Error("Interest already sent");

  // ✅ find biodata for sender & receiver
  const senderBiodata = await Biodata.findOne({ userId: senderId });
  const receiverBiodata = await Biodata.findOne({ userId: receiverId });

  if (!senderBiodata || !receiverBiodata) {
    throw new Error("Biodata not found for sender or receiver");
  }

  const interest = new Interest({
    sender: senderId,
    receiver: receiverId,
    senderBiodata: senderBiodata._id,     // ✅ store biodata
    receiverBiodata: receiverBiodata._id, // ✅ store biodata
  });

  return await interest.save();
};

const cancelInterest = async (senderId: string, receiverId: string): Promise<IInterest | null> => {
  return await Interest.findOneAndUpdate(
    { sender: senderId, receiver: receiverId, status: "sent" },
    { status: "cancelled" },
    { new: true }
  );
};

const getSentInterests = async (userId: string) => {
  return await Interest.find({ sender: userId, status: "sent" })
    .populate("receiver", "name ")
    .populate("receiverBiodata"); // ✅ include biodata
};

const getReceivedInterests = async (userId: string) => {
  return await Interest.find({ receiver: userId, status: "sent" })
    .populate("sender", "name ")
    .populate("senderBiodata"); // ✅ include biodata
};

export const InterestServices = {
  sendInterest,
  cancelInterest,
  getSentInterests,
  getReceivedInterests,
};
