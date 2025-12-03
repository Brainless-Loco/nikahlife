import { Schema, model } from "mongoose";
import { IPayment } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    transactionId: { type: String },
    senderNumber: { type: String },
    paidAmount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    additionalNotes: { type: String },
    approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    subscriptionType: { type: String, enum: ["premium", "vip","free"], required: true },
    durationInMonths: { type: Number, required: true },

  },
  { timestamps: true }
);

const Payment = model<IPayment>("Payment", paymentSchema);
export default Payment;
