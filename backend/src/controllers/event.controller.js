import { createEventService, 
        deleteEventService, 
        getAllEventsService, 
        getSingleEventService,
        updateEventService
      } from "../services/event.service.js";


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

export const getAllEventsController = async (req , res , next ) => {

    try {
         
        const id = req.user.id ;

        const result = await getAllEventsService(id) ; 

        res
            .status(200)
            .json(result) ; 

    } 
    
    catch (error) {
        
        next(error)
    }
}

export const getSingleEventController = async (req , res , next ) => {

    try {

        const { eventId } = req.params;

        const result = await getSingleEventService (eventId) ; 

        res
            .status(200)
            .json(result) ;


    } 
    
    catch (error) {

        next(error) ;
    }
} ; 

export const updateEventController = async(req , res , next) => {

    try {

        const organizerId = req.user.id ; 
        const  eventId  = req.params.eventId ;
        const data = req.body ; 
        
        
     const result =   await updateEventService(eventId , organizerId , data) ;

     res
        .status(200)
        .json(result) ;
    } 
    
    catch (error) {
        next(error) ; 
    }
} ;

export const deleteEventController = async (req , res , next) => {

    try {
        
    
    const  eventId  = req.params.eventId ; 
    const organizerId = req.user.id ; 

    const result = await deleteEventService(eventId , organizerId) ; 

    res
        .status(201)
        .json(result)

    } 
    
    catch (error) {

        next(error) ; 
        
    }
} ;