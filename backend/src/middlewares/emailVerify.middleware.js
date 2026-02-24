import AppError from "../errors/app.error.js";


const verifyEmailMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isEmailVerified) {
    return next(AppError.unauthorized('User is not verified'));
  }

  next();
};

export default verifyEmailMiddleware; 