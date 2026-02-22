import jwt from 'jsonwebtoken';
import AppError from '../errors/app.error.js';
import { ACCESS_TOKEN_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

const protect = async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }


    if (!token) {
        return next(new AppError.unauthorized("Authentication required "));
    }


    try {


        const decoded = jwt.verify(
            token,
            ACCESS_TOKEN_SECRET
        );

       
        const user = await User
                                .findById(decoded.id)
                                .select('+tokenVersion');
                                

        if (!user)
         return next(new AppError.unauthorized('Invalid token'));

        if ((decoded.tokenVersion || 0) !== (user.tokenVersion || 0)) {
            return next(new AppError.unauthorized('Token revoked'));
        }

        req.user = decoded;
        next();

    }
    catch (error) {

        return next(new AppError.unauthorized('Invalid or expired access token'));

    }
};

export default protect; 