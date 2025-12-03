import { Schema, model } from "mongoose";
import { IShortlist } from "./shortList.interface";

const shortlistSchema = new Schema<IShortlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    biodataId: { type: Schema.Types.ObjectId, ref: "Biodata", required: true },
  },
  { timestamps: true }
);

export const Shortlist = model<IShortlist>("Shortlist", shortlistSchema);
