// ignore.model.ts
import mongoose, { Schema, Document } from "mongoose";
import { IIgnore } from "./ignoreList.interface";


const IgnoreSchema = new Schema<IIgnore>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ignoredUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

IgnoreSchema.index({ user: 1, ignoredUser: 1 }, { unique: true });

export const Ignore = mongoose.model<IIgnore>("Ignore", IgnoreSchema);
