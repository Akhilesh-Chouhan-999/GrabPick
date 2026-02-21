import { configDotenv } from "dotenv";

configDotenv() ; 


export const PORT = process.env.PORT || 5000; 
export const MONGO_URI = process.env.MONGO_URI ;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES;
