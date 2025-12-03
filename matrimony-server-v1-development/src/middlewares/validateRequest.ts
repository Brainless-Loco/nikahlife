import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
    
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
