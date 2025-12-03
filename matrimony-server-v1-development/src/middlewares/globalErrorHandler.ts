/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import { envVars } from "../config/envConfig";


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (envVars.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  let statusCode = 500;
  let message = "Something went wrong!";
  const errorSource: any[] = [];

  // App specific error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } 
  // Duplicate key error (Mongo)
  else if (err.code === 11000) {
    const matchedArray = err.message.match(/"([^"]*)"/);
    statusCode = 400;
    message = `Duplicate field value: ${matchedArray ? matchedArray[1] : "field"} already exists.`;
  } 
  // MongoDB ObjectId invalid
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid MongoDB ID: ${err.value}`;
  } 
  // Mongoose validation error
  else if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors);
    errors.forEach((errorObject: any) => {
      errorSource.push({
        path: errorObject.path,
        message: errorObject.message,
      });
    });
    message = "Validation Error";
  } 
  // Zod validation error
  else if (err.name === "ZodError") {
    statusCode = 400;
    message = "Zod Validation Error";
    err.issues.forEach((issue: any) => {
      errorSource.push({
        path: issue.path.join("."),
        message: issue.message,
      });
    });
  } 
  // Generic error
  else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource: errorSource.length ? errorSource : undefined,
    error: envVars.NODE_ENV === "development" ? err : undefined,
    stack: envVars.NODE_ENV === "development" ? err.stack : undefined,
  });
};
