import express from 'express' ; 
import { refreshTokenHandler } from '../utils/refreshToken.utils.js';
import protect from '../middlewares/auth.middleware.js';
import { resendVerificationEmail, 
        verifyEmail 
        } from '../services/email.service.js';
import { 
    login, 
    register, 
    logout, 
    getCurrentUser, 
    changePassword, 
    forgotPassword, 
    resetPassword
}   from '../controllers/auth.controller.js';


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


router.get(
  "/verify-email/:token",
  verifyEmail
);


router.post(
  "/resend-verification", 
  protect ,            
  resendVerificationEmail
);

export default router ;