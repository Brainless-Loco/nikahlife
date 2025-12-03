import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";

  JWT_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_SECRET_EXPIRED: string;
  FRONTEND_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SESSION_SECRET: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
   
    
    "JWT_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_SECRET_EXPIRED",
    "FRONTEND_URL"
    ,"GOOGLE_CLIENT_ID"
    ,"GOOGLE_CLIENT_SECRET"
    ,"GOOGLE_CALLBACK_URL"
    ,"SMTP_USER"
    ,"SMTP_PASS"
    ,"SESSION_SECRET"
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",


    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_SECRET_EXPIRED: process.env.JWT_REFRESH_SECRET_EXPIRED as string,
    FRONTEND_URL:process.env.FRONTEND_URL as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    SMTP_USER: process.env.SMTP_USER as string,
    SMTP_PASS: process.env.SMTP_PASS as string,
    SESSION_SECRET: process.env.SESSION_SECRET as string,

  };
};

export const envVars = loadEnvVariables();
