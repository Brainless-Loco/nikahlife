import { Request, Response } from 'express';
import { sendOtpEmail } from '../services/emailService';
import { OtpModel } from '../module/otp/OtpModel';
import { generateOTP } from '../../utils/generateOTP';

// ✅ Send OTP
export const sendOtp = async (req: Request, res: Response) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ message: 'Email or phone number is required' });
  }

  const otp = generateOTP();

  try {
    if (email) {
      await sendOtpEmail(email, otp);
      await OtpModel.create({ email, otp });
      return res.status(200).json({ message: 'OTP sent to email successfully' });
    } else if (phone) {
      // TODO: Implement SMS sending service
      // For now, we'll just store it - SMS integration needed
      await OtpModel.create({ phone, otp });
      console.log(`OTP for phone ${phone}: ${otp}`); // Remove in production
      return res.status(200).json({ message: 'OTP sent to phone successfully' });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// ✅ Verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, phone, otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }

  if (!email && !phone) {
    return res.status(400).json({ message: 'Email or phone number is required' });
  }

  try {
    let existingOtp;
    
    if (email) {
      existingOtp = await OtpModel.findOne({ email, otp });
    } else if (phone) {
      existingOtp = await OtpModel.findOne({ phone, otp });
    }

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
