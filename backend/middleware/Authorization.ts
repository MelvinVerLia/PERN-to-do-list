import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: string; // User ID from JWT payload
}

export const authorize = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const jwtToken = req.cookies.token; 
    if (!jwtToken) {
      res.status(403).json("Not Authorized");
      return;
    }
    const payload = jwt.verify(
      jwtToken,
      process.env.jwtSecret as string
    ) as jwt.JwtPayload;
    
    if (!payload || !payload.id) {
      res.status(403).json("Invalid Token");
      return;
    }

    req.user = payload.id;
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(403).json("Not Authorized");
    return;
  }
};


