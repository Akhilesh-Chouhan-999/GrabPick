import AppError from "../errors/app.error.js" ; 
import Event from "../models/event.model.js";

export const createEventService = async (organizerId, userData) => {

    if (!organizerId) {
        throw new AppError("Organizer ID is required", 400);
    }

    const allowedCreateEventFields = [
        "title",
        "description",
        "eventDate",
        "location"
    ];

    const filteredData = {};

    allowedCreateEventFields.forEach((field) => {

        if (userData[field] !== undefined) {
            filteredData[field] = userData[field];
        }

    });

    const event = await Event.create({
                    ...filteredData,
                    organizerId
                 });

    return {
        event
    };

};

export const getEventService =   async (eventId) => {
    
    if(!eventId)
    throw new AppError("Id not found" , 400) ;

    const event = await Event.findById(eventId) ;

    if(!event)
    throw new AppError("Event not found" , 400) ;

    return {
        event 
    } 

} ;