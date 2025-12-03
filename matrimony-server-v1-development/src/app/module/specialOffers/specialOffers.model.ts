import { Schema, model } from "mongoose";

const specialOfferSchema = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String },
    description: { type: String, required: true },
    validTill: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SpecialOffer = model("SpecialOffer", specialOfferSchema);
