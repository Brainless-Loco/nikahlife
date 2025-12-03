import { Request, Response } from 'express';
import { sendOtpEmail } from '../services/emailService';
import { OtpModel } from '../module/otp/OtpModel';
import { generateOTP } from '../../utils/generateOTP';

// ✅ Send OTP
export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = generateOTP();

  try {
    await sendOtpEmail(email, otp);
    await OtpModel.create({ email, otp });

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// ✅ Verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const existingOtp = await OtpModel.findOne({ email, otp });

    if (!existingOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP is valid, delete it from the database
    await OtpModel.deleteOne({ _id: existingOtp._id });

    return res.status(200).json({ message: 'OTP verified successfully' });

  } catch (error) {
    console.error('OTP verify error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
