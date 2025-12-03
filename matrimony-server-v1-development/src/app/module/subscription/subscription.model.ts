import { Schema, model } from "mongoose";
import { ISubscription } from "./subscription.interface";

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionType: { type: String, enum: ["free", "premium", "vip"], required: true, default: "free" },
    durationInMonths: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["active", "inactive", "expired"], default: "inactive" },
    profileViewLimit: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

const Subscription = model<ISubscription>("Subscription", subscriptionSchema);
export default Subscription;
