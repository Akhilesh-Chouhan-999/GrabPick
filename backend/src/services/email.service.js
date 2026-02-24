import crypto from "crypto";
import User from "../models/user.model.js";
import AppError from "../errors/app.error.js";
import { sendVerificationEmail } from "../utils/email.util.js";

export const verifyEmail = async (req, res, next) => {
    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: Date.now() },
        });

        if (!user) {
            return next(AppError.notFound('User not found'));
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;

        await user.save();

        res.status(200).json({
            message: 'Email verified successfully',
        });
    } catch (error) {
        next(error);
    }
};


export const resendVerificationEmail = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return next(AppError.notFound('User not found'));
        }

        if (user.isEmailVerified) {
            return next(new AppError('Email is already verified', 409));
        }

        const verificationToken = user.createEmailVerificationToken();

        await user.save({ validateBeforeSave: false });

        await sendVerificationEmail(user, verificationToken);

        res.status(200).json({
            message: 'Verification email sent successfully',
        });
    } catch (error) {
        next(error);
    }
};