class AppError extends Error{

    constructor(message , statusCode , errorCode = null , details = null  , meta = null) {
        
        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error' ; 
        this.errorCode = errorCode;
        this.meta = meta;
        this.timestamp = new Date().toISOString() ;
        this.isOperational = true ;
        this.expose = this.statusCode < 600;
        this.details = details ;

        Error.captureStackTrace(this , this.constructor) ;

    }

    static notFound(message = 'Resource not found'){
        return new AppError(message , 404 , 'NOT_FOUND') ;
    }

    static badRequest(message = 'Bad request'){
        return new AppError(message , 400 , 'BAD_REQUEST')
    }

    static internal(message = 'Internal server Error'){
        return new AppError(message , 500 , 'INTERNAL_ERROR') ;
    }

    static unauthorized(message = 'Unauthorized'){
        return new AppError(message , 401 , 'UNAUTHORIZED') ;
    }

    static forbidden(message = 'Forbidden'){
        return new AppError(message , 403 , 'FORBIDDEN') ;
    }
}

export default AppError ; 