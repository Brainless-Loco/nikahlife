import nodemailer from "nodemailer";
import { envVars } from "./envConfig";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
  },
});
