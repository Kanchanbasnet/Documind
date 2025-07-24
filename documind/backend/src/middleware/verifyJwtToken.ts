import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

export interface CustomRequest extends Request {
  token: String | JwtPayload;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token is required." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid Token." });
    }

    (req as CustomRequest).token = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
