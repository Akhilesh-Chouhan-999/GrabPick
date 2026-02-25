# 🚀 GrabPic — AI-assisted Image Generation & Management

GrabPic is an AI-assisted image generation and management platform focused on user-centric graphics, face embeddings, and secure asset lifecycle management. The repository contains a production-oriented Node/Express backend that exposes RESTful APIs for authentication, profile management, image uploads, face-embedding extraction (using face-api.js and TensorFlow.js), and background job processing (BullMQ + Redis). Model artifacts used for detection/recognition are included under `backend/models`.

## 📌 Project Overview

GrabPic provides backend services to:

- Produce and store AI-assisted graphics and generated assets (prompt-driven or model-assisted)
- Extract and store face embeddings for matching/verification workflows
- Handle secure user authentication and profile/avatar management
- Process image-related background work via queues (BullMQ)

The backend is designed to be modular and production-ready, with clear extension points for cloud storage (S3/Cloudinary), external AI APIs, and containerized deployment.

## 🏗 System Architecture

GrabPic follows a layered architecture:

Client (Frontend - React) → API Layer (Express.js) → Service Layer → Database (MongoDB) → AI Integration Layer

## 🛠 Tech Stack

- Frontend: React.js, Axios
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Auth: JWT, bcrypt
- File uploads: Multer (local uploads, S3-ready integrations)
- Background jobs: BullMQ (Redis)
- AI/ML: face-api.js / TensorFlow.js model artifacts included in `backend/models`

## 🔧 Install & Run (Local)

1. Clone the repository and open the workspace root.

2. Backend setup

```powershell
cd backend
npm install
# development
npm run dev
# production
npm start
```

Notes:

- Copy `.env.example` to `.env` and update environment variables accordingly.
- Backend scripts are defined in [backend/package.json](backend/package.json).

3. Frontend setup (if present)

```powershell
cd frontend
npm install
npm start
```

## ⚙️ Configuration

- Environment variables are managed in `backend/.env` (see `backend/.env.example`).
- Key settings: database URI, JWT secret, email SMTP credentials, Redis URL, and cloud storage credentials.

## 🔐 Authentication & Security

- Signup & Login with JWT
- HttpOnly cookies recommended for storing refresh tokens
- Password hashing with `bcrypt`
- Email-based password reset using encrypted tokens

## 🖼 Uploads & Profiles

- Avatar upload handled via `multer` middleware
- Old avatar cleanup on update
- Uploads stored in `backend/uploads` (profile-images), easily switchable to S3 or other providers

See `src/middlewares/upload.middleware.js` and `src/controllers/user.controller.js` for implementation details.

## 🧠 AI & ML Integration

- Face/feature models are present under `backend/models` (`tiny_face_detector`, `face_landmark_68`, `face_recognition`).
- AI client integration is in `src/integrations/ml.client.js` and services referencing embeddings in `src/services/embedding.service.js`.

## 📂 Project Structure (Backend)

- `src/controllers` — request handlers
- `src/services` — business logic
- `src/models` — Mongoose models
- `src/routes` — express routes
- `src/middlewares` — auth, upload, error handling
- `src/integrations` — cloud / ML clients
- `uploads/` — persistent file storage (local)

## 🧪 Tests

- A small test/example exists at `src/tests/testEmbedding.js` — extend with your preferred test runner.

## ▶️ Common Commands

- Install backend deps: `cd backend && npm install`
- Start backend in dev: `npm run dev`
- Start backend in prod: `npm start`

## 🚀 Production & Scalability Notes

- Replace local file storage with S3/Cloudinary for horizontal scale
- Use managed Redis for BullMQ jobs and caching
- Containerize with Docker and orchestrate with Kubernetes for microservice scale
- External AI APIs can replace local models for faster/cheaper generation

## 👨‍💻 Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Add tests and documentation
4. Open a pull request

## 📄 License

Add your preferred license to the repository root (e.g., `LICENSE`).

## ✍️ Author

**Akhilesh Chouhan**
B.Tech Computer Science
Full-Stack & AI Enthusiast

Focused on building scalable, production-grade applications with intelligent system design.

## 🚀 GrabPic — Event Photo Discovery (Use Case)

Find your event photos instantly using face recognition.

GrabPic is a full-stack, production-ready web platform that allows event attendees to instantly find their photos from thousands of event images using AI-powered face recognition.

## 📌 Problem Statement

At large events like:

- 🎉 Weddings
- 🎵 Concerts
- 🎓 College fests
- 🏢 Conferences

Organizers upload thousands of photos. Attendees struggle to manually scroll and find their own pictures.

Manual searching is:

- ❌ Time-consuming
- ❌ Frustrating
- ❌ Inefficient

## 💡 Solution

Grappic solves this problem using face recognition technology.

How it works:

1. Organizer uploads event photos.
2. Faces are detected and converted into numerical embeddings.
3. Attendee joins the event.
4. Attendee takes a selfie.
5. The system matches the selfie embedding with stored embeddings.
6. Matched photos are instantly displayed.

No manual searching required.

## 🧠 Key Features

### 👨‍💼 Organizer

- Secure authentication (JWT-based)
- Create and manage events
- Bulk photo upload
- Background face processing
- Event-level data isolation
- Upload progress tracking

### 🙋 Attendee

- Join event via Event Code / QR
- Capture selfie using browser camera
- AI-powered face matching
- View matched photos
- Download selected photos

## 🏗️ System Architecture

High-Level Architecture

Frontend (React)
|
Backend API (Node.js + Express)
|

---

| Auth Service |
| Event Service |
| Upload Service |
| Face Processing Service |
| Vector Matching Engine |

---

    			|

---

| MongoDB (Metadata + Embeddings) |
| Cloud Storage (Images - S3) |

---

## 🔁 System Data Flow

### 📷 Organizer Upload Flow

1. Organizer logs in
2. Creates event
3. Uploads bulk photos
4. Images stored in cloud storage
5. Each image processed: face detection, face cropping, embedding generation
6. Embeddings stored with photo reference

### 🤳 Attendee Matching Flow

1. Attendee joins event
2. Takes selfie
3. Face detected
4. Embedding generated
5. Similarity search performed within event scope
6. Matching photo IDs retrieved
7. Signed image URLs returned
8. Results displayed

## 🗄️ Database Design

User
{
\_id,
name,
email,
passwordHash,
role: "ORGANIZER"
}
Event
{
\_id,
name,
description,
date,
organizerId,
eventCode,
createdAt
}
Photo
{
\_id,
eventId,
imageUrl,
uploadedAt
}
FaceEmbedding
{
\_id,
eventId,
photoId,
vector: [Number],
faceBox,
createdAt
}

## 🤖 Face Recognition Logic

1. Face Detection — Detects face location inside image.

2. Face Embedding — Converts face into numerical vector (e.g., 128–512 numbers). Embeddings are faster to compare, privacy-safe, and lightweight to store.

3. Similarity Search — Compare selfie vector with stored vectors, apply threshold, and retrieve closest matches.

## 🔐 Security & Privacy

- Event-scoped face matching
- JWT-based authentication
- No identity storage for attendees
- Signed URLs for secure image access
- Optional event deletion
- Embeddings instead of raw face data (privacy-first)

## ⚙️ Tech Stack

Frontend

- React.js
- Axios
- Tailwind / CSS

Backend

- Node.js
- Express.js
- JWT Authentication
- Multer (file uploads)

Database

- MongoDB

AI Processing

- Face Detection Model
- Face Embedding Model
- Cosine Similarity Matching

Storage

- AWS S3 / Cloudinary

## 📦 API Structure

Auth
POST /auth/signup
POST /auth/login

Event
POST /events
GET /events/:id

Upload
POST /events/:id/photos
POST /events/:id/process

Matching
POST /events/:id/selfie
GET /events/:id/results

## 🚀 Deployment

Frontend: Vercel

Backend: AWS EC2 / Render / Railway

Storage: AWS S3

Use environment variables for secrets and design for scalable GPU integration in future.

## 📊 Scalability Strategy

Phase 1 (MVP)

- Single backend instance
- MongoDB vector storage
- CPU-based face processing

Phase 2

- Background job queue
- Redis caching
- CDN for images

Phase 3

- Dedicated vector database
- GPU acceleration
- Microservice architecture

## 🧪 Testing Strategy

- Small dataset testing
- Multiple face validation
- Edge cases: No face detected, Multiple faces in selfie, Blurry images
- Performance testing with 1000+ images

## 📈 Future Enhancements

- Mobile app
- QR-based instant join
- Group tagging
- Paid organizer plans
- Organizer analytics dashboard
- Email notifications

End of event-photo content.
