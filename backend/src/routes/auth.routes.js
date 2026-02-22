import express from 'express' ; 
import { login, register, logout, getCurrentUser, changePassword, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
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

router.post(
    '/logout',
    logout
);


router.get(
    '/me/:id' ,
    getCurrentUser
) ;

router.patch(
    '/change-password' ,
     changePassword
)


router.post(
    '/forgot-password' ,
    forgotPassword
);

router.patch(
    '/reset-password/:token' ,
    resetPassword
) ; 

export default router ;