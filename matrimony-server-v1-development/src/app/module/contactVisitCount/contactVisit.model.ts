import { Schema, model, Types } from "mongoose";
import { IProfileVisit } from "./profileVisitCount.interface";

const profileVisitSchema = new Schema<IProfileVisit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    visitedProfiles: [
      {
        profileId: { type: Schema.Types.ObjectId, ref: "Biodata", required: true },
        email: { type: String },    
        phone: { type: String },   
        contactViewed: { type: Boolean, default: false },
        viewedAt: { type: Date, default: Date.now },
      },
    ],

    totalVisitedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProfileVisit = model<IProfileVisit>("ProfileVisit", profileVisitSchema);
export default ProfileVisit;
