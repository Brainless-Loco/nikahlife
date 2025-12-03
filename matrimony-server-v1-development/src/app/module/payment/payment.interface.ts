import { Types } from "mongoose";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface IPayment {
  _id?: string | Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  transactionId: string;
  senderNumber: string;
  paidAmount: number;
  paymentDate?: string;
  additionalNotes?: string;
  approvalStatus: ApprovalStatus;
  durationInMonths: number;
  subscriptionType: "premium" | "vip"; // added to determine subscription type
  createdAt?: Date;
  updatedAt?: Date;
  
}
