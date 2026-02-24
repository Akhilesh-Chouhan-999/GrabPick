import { createEventService, getEventService } from "../services/event.service.js";


export const createEventController = async (req , res , next ) => {

    try {

        const id = req.user.id ; 

        const result = await createEventService(id , req. body) ; 

        res
            .status(201)
            .json(result) ; 

    }
    
    catch (error) {
        
        next(error) ; 
        
    }
} ;

export const getEventController = async (req , res , next ) => {

    try {

        const { eventId } = req.params;

        const result = await getEventService(eventId) ; 

        res
            .status(200)
            .json(result) ;


    } 
    
    catch (error) {

        next(error) ;
    }
} ; 

