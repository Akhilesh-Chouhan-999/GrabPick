import { NODE_ENV } from '../config/env.js';
import AppError from '../errors/app.error.js';

const errorHandler = (err, req, res, next) => {

    if (!err) 
    return next();

    if (err.name === 'ValidationError'){

        const messages = Object
                                .values(err.errors)
                                .map(e => e.message)
                                .join(', ');


        err = AppError.badRequest(messages);
    } 
    
    else if (err.name === 'CastError') {

        err = AppError.badRequest('Invalid ID format');

    }
    
    else if (err.code && err.code === 11000) {

        const fields = Object.keys(err.keyValue || {}).join(', ');

        err = new AppError(`${fields} already exists`, 409, 'DUPLICATE_KEY');

    }

    const statusCode = err.statusCode || 500;
    
    const payload = {

        status: err.status || (String(statusCode).startsWith('4') ? 'fail' : 'error'),
        
        message: err.message || 'Internal Server Error',

        errorCode: err.errorCode || null,

        details: err.details || null,

        timestamp: err.timestamp || new Date().toISOString(),
    };

    if (NODE_ENV !== 'production') {
        payload.stack = err.stack;
    }

    res.status(statusCode).json(payload);
};

export default errorHandler;
