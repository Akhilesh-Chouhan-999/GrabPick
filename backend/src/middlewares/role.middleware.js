import AppError from "../errors/app.error.js";


export const authorizeOrganizer = (req, res, next) => {

  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  if (req.user.role !== 'ORGANIZER') {
    return next(new AppError("Only organizers can access this resource", 403));
  }

  next();
};