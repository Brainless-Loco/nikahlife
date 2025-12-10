import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
  email?: string;
  phone?: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, sparse: true },
  phone: { type: String, sparse: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

export const OtpModel = mongoose.model<IOtp>('Otp', otpSchema);
