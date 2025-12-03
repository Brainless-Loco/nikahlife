// user.interface.ts
import { Types } from "mongoose";

export type UserRole = "user" | "admin";
export type SubscriptionType = "free" | "premium" | "vip";
export type GenderType = "male" | "female";

export interface IUser {
  _id?: Types.ObjectId; 
  userId?: string;
  name: string;
  password: string;
  gender: GenderType;
  email: string;
  phone: string;
  role: UserRole;
  agreeToPrivacy: boolean;
  agreeToTerms: boolean;
  isVerified?: boolean;
  subscriptionType?: SubscriptionType;
  subscriptionId?: Types.ObjectId;
  hasBiodata?: boolean;
  isProfileCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthUser {
  userId: string;        
  email: string;         
  _id?: Types.ObjectId | string; 
  name?: string;
  gender?: GenderType;
  role?: UserRole;
  hasBiodata?: boolean;
  subscriptionType?: SubscriptionType;
  phone?: string;
  isVerified?: boolean;
  isProfileCompleted?: boolean;
  agreeToPrivacy?: boolean;
  agreeToTerms?: boolean;
  subscriptionId?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}