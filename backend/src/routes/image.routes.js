import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import protect from '../middlewares/auth.middleware.js';
import {authorizeOrganizer} from '../middlewares/role.middleware.js' ; 
import {
  uploadEventImageController,
  getEventImagesController,
  matchFaceInEventController,
  deleteImageController
} from '../controllers/image.controller.js';

const router = express.Router();

router.post(
  '/:eventId/images',
  protect,
  upload.single('image'),
  uploadEventImageController
);

router.get(
  '/:eventId/images',
  protect,
  getEventImagesController
);

router.post(
  '/:eventId/match',
  protect,
  upload.single('image'),
  matchFaceInEventController
);

router.delete(
  '/:imageId',
  protect,
  authorizeOrganizer ,
  deleteImageController
);


export default router;