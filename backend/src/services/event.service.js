import AppError from "../errors/app.error.js" ; 
import Event from "../models/event.model.js";
import fs from 'fs' ; 
import path from 'path' ; 

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

export const getSingleEventService  =   async (eventId) => {
    
    if(!eventId)
    throw new AppError("Id not found" , 400) ;

    const event = await Event.findById(eventId) ;

    if(!event)
    throw new AppError("Event not found" , 400) ;

    return {
        event 
    } 

} ;

export const getAllEventsService = async (organizerId) => {

  if (!organizerId)
    throw new AppError("Organizer not found", 404);

  const events = await Event.find({ organizerId })
                            .sort({ createdAt: -1 });

  return events;

};

export const updateEventService = async (eventId, organizerId, updateData) => {

  const event = await Event.findById(eventId);

  if (!event)
    throw new AppError("Event not found", 404);

  if (event.organizerId.toString() !== organizerId)
    throw new AppError("Not authorized", 403);

  Object.assign(event, updateData);

  await event.save();

  return event;
};


export const deleteEventService = async (eventId, organizerId) => {

  const event = await Event.findById(eventId);

  if (!event)
    throw new AppError('Event not found', 404);

  if (event.organizerId.toString() !== organizerId)
    throw new AppError('Not authorized', 403);

  const images = await Image.find({ eventId });

  for (const img of images) {

    const absolutePath = path.resolve(img.imageUrl);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await Image.findByIdAndDelete(img._id);
  }

  await Event.findByIdAndDelete(eventId);

  return { message: 'Event and related images deleted successfully' };
};