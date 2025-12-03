import mongoose from "mongoose";

export interface IIgnore extends Document {
  user: mongoose.Types.ObjectId;
  ignoredUser: mongoose.Types.ObjectId;
  createdAt: Date;
}