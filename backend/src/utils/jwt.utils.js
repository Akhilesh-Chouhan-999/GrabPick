import jwt from "jsonwebtoken";
import AppError from "../errors/app.error.js";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES
} from "../config/env.js";

export const generateAccessToken = (payload) => {

  if (!payload || typeof payload !== "object") {
    throw new AppError("JWT payload must be an object", 422);
  }

  if (!ACCESS_TOKEN_SECRET) {
    throw new AppError("Access token secret not configured", 500);
  }

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
    algorithm: "HS256",
  });
  
};

export const generateRefreshToken = (payload) => {

  if (!payload || typeof payload !== "object") {
    throw new AppError("JWT payload must be an object", 422);
  }

  if (!REFRESH_TOKEN_SECRET) {
    throw new AppError("Refresh token secret not configured", 500);
  }

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
    algorithm: "HS256",
  });
};
