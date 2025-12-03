import { Types } from "mongoose";

export interface IInterest {
  _id?: Types.ObjectId;
  sender: Types.ObjectId;  
  receiver: Types.ObjectId; 
  senderBiodata:Types.ObjectId;
receiverBiodata:Types.ObjectId;
  status: "sent" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}
