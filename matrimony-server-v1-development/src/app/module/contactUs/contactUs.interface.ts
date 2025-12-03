import { Document } from "mongoose";

export type ContactStatus = "new" | "seen" | "resolved";

export interface IContact extends Document {
  email: string;
  subject: string;
  body: string;
  date: Date;
  status: ContactStatus;
}
