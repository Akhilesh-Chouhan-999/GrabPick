import express from 'express' ; 
import { login, register } from '../controllers/auth.controller.js';
import { refreshTokenHandler } from '../utils/refreshToken.utils.js';
const router = express.Router() ; 

router.post(
    '/register' ,
    register
);

router.post(
    '/login' ,
    login 
) ;

router.post(
    '/refresh' , 
    refreshTokenHandler
) ;


// router.post(
//     '/logout' ,

// )

export default router ;