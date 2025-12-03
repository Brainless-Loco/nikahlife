import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const checkAlreadyLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(); // no token,proceed to login
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
    // If token is valid, user is already logged in
    return res.status(400).json({ message: "You are already logged in" });
  } catch (err) {
    // Token invalid or expired, proceed to login
    next();
  }
};
