import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import protect from '../middlewares/auth.middleware.js';
import {
  uploadEventImageController,
  getEventImagesController,
  matchFaceInEventController
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

export default router;