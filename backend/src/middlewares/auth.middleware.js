import jwt from 'jsonwebtoken' ;
import AppError from '../errors/app.error.js';
import {  ACCESS_TOKEN_SECRET } from '../config/env.js';

const protect = (req , res , next) => {

    let token ; 

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        token = req.headers.authorization.split(" ")[1] ; 
    }


    if(!token){
        return next(new AppError.unauthorized("Authentication required ")) ; 
    }


    try {
        
        const decoded = jwt.verify(
            token , 
             ACCESS_TOKEN_SECRET
        )  ; 

        req.user = decoded ; 
        next() ; 

    } 
    catch (error) {

        return next(new AppError.unauthorized('Invalid or expired access tokne')) ; 
        
    }
} ;

export default protect ; 