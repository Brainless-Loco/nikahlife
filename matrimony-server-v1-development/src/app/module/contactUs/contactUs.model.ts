import { Schema, model } from "mongoose";
import { IContact } from "./contactUs.interface";

const contactSchema = new Schema<IContact>(
  {
    email: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    date: { type: Date, default: Date.now },
 
  },
  { timestamps: true }
);

export const Contact = model<IContact>("Contact", contactSchema);
