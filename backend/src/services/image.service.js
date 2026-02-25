import { loadImage } from "canvas";
import { cosineSimilarity } from '../utils/vector.utils.js';
import AppError from "../errors/app.error.js";
import Event from "../models/event.model.js";
import { loadModels } from "./embedding.service.js";
import * as faceapi from 'face-api.js' ; 
import Image from "../models/image.model.js";


export const uploadEventImageService = async (eventId , userId , imagePath ) => {

    const event = await Event.findById(eventId) ; 

    if(!event)
    throw new AppError.notFound("Event not found") ; 

    if(event.organizerId.toString() !== userId)
        throw new AppError('Only organizer can upload event images ' , 401) ; 

    await loadModels() ; 

    const img = await loadImage(imagePath) ;

    const detections = await faceapi
                                    .detectAllFaces(
                                        img,
                                       new faceapi.TinyFaceDetectorOptions({ inputSize: 608 , scoreThreshold : 0.5 })
                                    )
                                    .withFaceLandmarks()
                                    .withFaceDescriptors();

    if(!detections.length)
    throw new AppError('No faces detected in image' , 400) ; 


      const faces = detections.map(det => ({
                    embedding: Array.from(det.descriptor),
                    box: {
                    x: det.detection.box.x,
                    y: det.detection.box.y,
                    width: det.detection.box.width,
                    height: det.detection.box.height
            }
        }));


        const imageDoc = await Image.create({
            eventId ,
            uploadedBy : userId ,
            imageUrl : imagePath ,
            faces 
        }) ; 


        return imageDoc ; 


} ;


export const matchFaceInEventService = async (eventId, imagePath) => {


  const event = await Event.findById(eventId);

  if (!event) {
    throw AppError.notFound('Event not found');
  }

  await loadModels();

  const img = await loadImage(imagePath);

  const detection = await faceapi
    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    throw AppError.badRequest('No face detected in selfie');
  }

  const queryEmbedding = Array.from(detection.descriptor);

  const images = await Image.find({ eventId });

  const threshold = 0.6; // you can tune this
  const matchedImages = [];

  for (const image of images) {

    for (const face of image.faces) {

      const similarity = cosineSimilarity(
                                            queryEmbedding,
                                            face.embedding
                                        );

      if (similarity > threshold) {
        matchedImages.push({
          imageUrl: image.imageUrl,
          similarity
        });
        break;
      }
    }
  }

  return matchedImages;
};