import { asyncHandler } from "../Utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../Models/user.model";
import { ApiError } from "../Utils/apiError";
import { Request, Response, NextFunction } from "express";

interface DecodedToken extends JwtPayload {
  _id: string;
}

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Access denied. No token provided.");
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new ApiError(500, "JWT secret not configured");
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as DecodedToken;

    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  }
);
