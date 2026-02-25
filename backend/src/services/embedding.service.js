import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';
import canvas from 'canvas';
import path from 'path';

const { Canvas, Image, ImageData } = canvas;

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

export const loadModels = async () => {
  if (modelsLoaded) return;

  // IMPORTANT: always load models from backend root
  const modelPath = path.resolve('models');

  await faceapi.nets.tinyFaceDetector.loadFromDisk(
    path.join(modelPath, 'tiny_face_detector')
  );

  await faceapi.nets.faceLandmark68Net.loadFromDisk(
    path.join(modelPath, 'face_landmark_68')
  );

  await faceapi.nets.faceRecognitionNet.loadFromDisk(
    path.join(modelPath, 'face_recognition')
  );

  modelsLoaded = true;
};

export const generateFaceEmbedding = async (imagePath) => {
  await loadModels();

  const img = await canvas.loadImage(imagePath);

  const detection = await faceapi
    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    throw new Error('No face detected in image');
  }

  return Array.from(detection.descriptor);
};