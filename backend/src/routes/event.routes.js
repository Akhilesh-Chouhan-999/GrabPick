import express from 'express' ; 
import { createEventController, 
        getEventController 
        } from '../controllers/event.controller.js';
import protect from '../middlewares/auth.middleware.js';
import { authorizeOrganizer } from '../middlewares/role.middleware.js';


const router = express.Router() ; 


router.post(
    '/create-event' , 
    protect ,
    authorizeOrganizer , 
    createEventController 
) ; 

router.get(
    '/:eventId', 
    getEventController
);

export default router ; 