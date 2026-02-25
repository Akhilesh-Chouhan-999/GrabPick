import { matchFaceInEventService, 
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
}


export const getEventImagesController = async (req , res , next ) => {

    try {
        
    } 
    catch (error) {
        
    }
} ;


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

}