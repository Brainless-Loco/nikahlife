// const { body, validationResult } = require('express-validator');

// export const validatePayment = [
//     body('email')
//         .isEmail()
//         .withMessage('Valid email is required')
//         .normalizeEmail(),
    
//     body('name')
//         .trim()
//         .isLength({ min: 2, max: 50 })
//         .withMessage('Name must be between 2-50 characters')
//         .matches(/^[a-zA-Z\s]+$/)
//         .withMessage('Name should only contain letters and spaces'),
    
//     body('phone')
//         .trim()
//         .matches(/^(\+880|880|0)?1[3-9]\d{8}$/)
//         .withMessage('Valid Bangladeshi phone number is required'),
    
//     (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Validation failed',
//                 errors: errors.array()
//             });
//         }
//         next();
//     }
// ];


import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Zod Schema

const paymentSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  name: z
    .string()
    .min(2, { message: "Name must be between 2-50 characters" })
    .max(50, { message: "Name must be between 2-50 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name should only contain letters and spaces" }),
  phone: z
    .string()
    .regex(/^(\+880|880|0)?1[3-9]\d{8}$/, { message: "Valid Bangladeshi phone number is required" }),
  amount: z
    .number()
    .positive({ message: "Amount must be a positive number" }),
});


// Middleware
export const validatePayment = (req: Request, res: Response, next: NextFunction) => {
  const result = paymentSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: result.error.errors.map(err => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }

  // Optionally replace req.body with parsed version
  req.body = result.data;
  next();
};
