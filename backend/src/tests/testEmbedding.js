import { generateFaceEmbedding } from '../services/embedding.service.js';

const run = async () => {
  try {
    const embedding = await generateFaceEmbedding(
      'src/uploads/profile-images/test.jpg'
    );

    console.log('Embedding length:', embedding.length);
    console.log('First 5 values:', embedding.slice(0, 5));
  } catch (err) {
    console.error(err);
  }
};

run();