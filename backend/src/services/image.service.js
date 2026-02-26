import { loadImage } from "canvas";
import { cosineSimilarity, 
          normalizeVector 
        } from '../utils/vector.utils.js';
import AppError from "../errors/app.error.js";
import Event from "../models/event.model.js";
import { loadModels } from "./embedding.service.js";
import * as faceapi from 'face-api.js' ; 
import Image from "../models/image.model.js";
import fs from 'fs' ; 
import path from 'path' ; 


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
                    embedding: normalizeVector(Array.from(det.descriptor)),
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

export const getEventImagesService = async (eventId, page = 1, limit = 10) => {

  const skip = (page - 1) * limit;

  const images = await Image.find({ eventId })
    .select('-faces.embedding')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Image.countDocuments({ eventId });

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    images
  };
};

export const matchFaceInEventService = async (eventId, imagePath) => {


  const event = await Event.findById(eventId);

  if (!event) {
    throw AppError.notFound('Event not found');
  }

  await loadModels();

  const img = await loadImage(imagePath);

  const detection = await faceapi
    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({inputSize : 608 , scoreThreshold : 0.5}))
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

  matchedImages.sort((a, b) => b.similarity - a.similarity);

  const limitedResults = matchedImages.slice(0, 20);

  return {
  totalMatches: matchedImages.length,
  results: limitedResults
};

};

export const deleteImageService = async (imageId, organizerId) => {

  const image = await Image.findById(imageId);

  if (!image)
    throw new AppError('Image not found', 404);

  const event = await Event.findById(image.eventId);

  if (!event)
    throw new AppError('Event not found', 404);

  if (event.organizerId.toString() !== organizerId)
    throw new AppError('Not authorized', 403);

  // delete file from disk
  const absolutePath = path.resolve(image.imageUrl);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }

  await Image.findByIdAndDelete(imageId);

  return { message: 'Image deleted successfully' };
};