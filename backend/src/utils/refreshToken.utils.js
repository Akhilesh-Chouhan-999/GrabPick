import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from "../config/env.js";
import AppError from "../errors/app.error.js";
import User from "../models/user.model.js";
import { generateAccessToken } from "./jwt.utils.js";

export const refreshTokenHandler = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(AppError.unauthorized('Refresh token required'));
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return next(AppError.unauthorized('User not found'));
        }

        const newAccessToken = generateAccessToken({
            id: user._id,
            role: user.role,
        });

        res.json({
            accessToken: newAccessToken,
        });
    } catch (error) {
        next(AppError.unauthorized('Invalid refresh token'));
    }
};


