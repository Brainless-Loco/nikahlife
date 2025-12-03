// src/app/modules/mail/sendMail.model.ts
import { Schema, model } from "mongoose";

const mailSchema = new Schema(
  {
    subject: { type: String, required: true },
    body: { type: String, required: true },
    senderEmail: { type: String, ref: "User", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipients: [{ type: String, required: true }], 
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Mail = model("Mail", mailSchema);
