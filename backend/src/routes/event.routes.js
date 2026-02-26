import express from 'express' ; 
import { createEventController, 
        deleteEventController, 
        getAllEventsController, 
        getSingleEventController,
        updateEventController
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
    '/' ,
    protect ,
    authorizeOrganizer ,
    getAllEventsController
) ;

router.get(
    '/:eventId', 
    protect , 
    authorizeOrganizer ,
    getSingleEventController
);

router.patch(
  '/:eventId',
  protect,
  authorizeOrganizer,
  updateEventController
);

router.delete(
  '/:eventId',
  protect,
  authorizeOrganizer,
  deleteEventController
);


export default router ; 