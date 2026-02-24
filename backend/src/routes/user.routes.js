import express from 'express' ; 
import {
     deleteAccountController, 
     getUserByIdController, 
     updateAvatarController, 
     updateProfileController } 
     from '../controllers/user.controller.js';
import protect from '../middlewares/auth.middleware.js';
import  uploadProfileImage  from '../middlewares/upload.middleware.js';

const router = express.Router() ; 

router.get(
    '/:id', 
    getUserByIdController
);

router.patch(
    '/update-profile', 
    protect  ,
    updateProfileController
);

router.patch(
    '/update-avatar', 
    protect , 
    uploadProfileImage.single("profileImage") ,
    updateAvatarController
);

router.delete(
    '/delete-account', 
    protect ,
    deleteAccountController
);

export default router ; 


