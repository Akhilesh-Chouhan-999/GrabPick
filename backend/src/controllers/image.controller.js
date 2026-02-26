import { deleteImageService, 
        getEventImagesService, 
        matchFaceInEventService, 
        uploadEventImageService 
        } from "../services/image.service.js";


export const uploadEventImageController = async (req , res , next ) => {

    try {

        const { eventId } = req.params ;
        const userId = req.user.id ; 
        const filePath = req.file.path ;

        console.log(eventId , userId , filePath) ; 

        const result = await uploadEventImageService(eventId , userId , filePath) ; 

        res
            .status(201)
            .json(result) ; 

    } 
    
    catch (error) {
        
        next(error) ; 

    }
}; 

export const getEventImagesController = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { page = 1 , limit = 10 } = req.query ;

    const images = await getEventImagesService(eventId , Number(page) , Number(limit)) ;

    res.status(200).json({
      success: true,
      images
    });

  } catch (error) {
    next(error);
  }
};

export const matchFaceInEventController = async (req , res , next ) => {


    try {
        
        const { eventId } = req.params;

        const result = await matchFaceInEventService(eventId, req.file.path);

        res.status(200).json({
        success: true,
        matches: result
        });


    } catch (error) {
        
        next(error) ; 
    }

} ;

export const deleteImageController = async (req, res, next) => {
  try {
    const { imageId } = req.params;
    const organizerId = req.user.id;

    const result = await deleteImageService(imageId, organizerId);

    res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {
    next(error);
  }
};