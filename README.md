# GrabPick

**AI-powered event photo discovery using face recognition.**

Attendees upload a selfie and instantly find every event photo they appear in — no manual scrolling through thousands of images.

---

## Problem

At large events (weddings, concerts, college fests, conferences), organizers capture thousands of photos. Finding your own photos is slow, frustrating, and impractical.

## Solution

GrabPick uses face recognition to solve this:

1. **Organizer** creates an event and uploads photos.
2. Backend detects every face and stores a 128-dimensional embedding per face.
3. **Attendee** enters the event ID and uploads a selfie.
4. The system computes Euclidean distance between the selfie embedding and all stored embeddings.
5. Matching photos (distance < 0.6) are returned instantly, ranked by similarity.

---

## Features

### Organizer

- JWT-based authentication with email verification
- Create, update, and delete events
- Bulk image upload with automatic face detection
- Per-image face count and bounding box metadata
- Delete individual images

### Attendee

- Join any event via Event ID
- Upload a selfie to find matching photos
- AI-ranked results with similarity scores
- Lightbox image viewer

### Security

- Passwords hashed with bcrypt (salt 10)
- Access + refresh token rotation
- Email verification and password reset via secure tokens
- Helmet security headers
- Event-scoped data isolation
- Face embeddings stored instead of raw face data (privacy-first)

---

## Tech Stack

| Layer           | Technology                                                                 |
| --------------- | -------------------------------------------------------------------------- |
| Frontend        | React 19, React Router 7, Redux Toolkit, Tailwind CSS, Framer Motion, Vite |
| Backend         | Node.js, Express 5, Mongoose (MongoDB)                                     |
| Auth            | JWT (access + refresh tokens), bcrypt                                      |
| AI/ML           | face-api.js (SSD MobileNet v1 + FaceLandmark68 + FaceRecognitionNet)       |
| File Upload     | Multer (local disk, S3-ready)                                              |
| Background Jobs | BullMQ + Redis (IORedis)                                                   |
| Email           | Nodemailer                                                                 |

---

## System Architecture

```
┌──────────────────┐        ┌──────────────────────────────────┐
│   React Frontend │───────▶│     Express.js API Gateway       │
│   (Vite :5173)   │  proxy │         (Port 5000)              │
└──────────────────┘        └──────────┬───────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────────┐
                    │                  │                      │
             ┌──────▼──────┐   ┌──────▼──────┐   ┌──────────▼──────────┐
             │ Auth Service│   │Event Service │   │  Image Service      │
             │  (JWT/Email)│   │  (CRUD)      │   │  (Upload/Match)     │
             └──────┬──────┘   └──────┬──────┘   └──────────┬──────────┘
                    │                 │                      │
                    │                 │              ┌───────▼────────┐
                    │                 │              │  face-api.js   │
                    │                 │              │  SSD MobileNet │
                    │                 │              │  + Landmarks   │
                    │                 │              │  + Recognition │
                    │                 │              └───────┬────────┘
                    │                 │                      │
                    └────────┬────────┴──────────────────────┘
                             │
                      ┌──────▼──────┐         ┌─────────────┐
                      │   MongoDB   │         │    Redis     │
                      │  (Data +    │         │  (BullMQ     │
                      │  Embeddings)│         │   Queues)    │
                      └─────────────┘         └─────────────┘
```

### Data Flow

**Upload Flow:**
Organizer → Upload image → Multer saves to disk → SSD MobileNet detects all faces → 68-point landmarks extracted → 128-dim descriptor per face → Stored in MongoDB with image reference

**Match Flow:**
Attendee → Upload selfie → Detect single face → Generate 128-dim descriptor → Euclidean distance against all event face embeddings → Return images where distance < 0.6

---

## Database Schema

### User

| Field                  | Type    | Notes                                      |
| ---------------------- | ------- | ------------------------------------------ |
| name                   | String  | 3-30 chars                                 |
| email                  | String  | Unique, optional                           |
| phone                  | String  | Unique, required, 10-15 digits             |
| password               | String  | Min 8 chars, mixed case + number + special |
| role                   | Enum    | `ORGANIZER` \| `USER`                      |
| profileImage           | String  | Avatar URL                                 |
| isEmailVerified        | Boolean | Default false                              |
| refreshToken           | String  | Current refresh token                      |
| emailVerificationToken | String  | Hashed token                               |
| passwordResetToken     | String  | Hashed token                               |

### Event

| Field       | Type     | Notes        |
| ----------- | -------- | ------------ |
| title       | String   | Required     |
| description | String   | Optional     |
| organizerId | ObjectId | Ref: User    |
| eventDate   | Date     | Optional     |
| location    | String   | Optional     |
| isActive    | Boolean  | Default true |

### Image

| Field      | Type     | Notes                                                           |
| ---------- | -------- | --------------------------------------------------------------- |
| eventId    | ObjectId | Ref: Event                                                      |
| uploadedBy | ObjectId | Ref: User                                                       |
| imageUrl   | String   | File path on disk                                               |
| faces      | Array    | Array of `{ embedding: [128 floats], box: {x,y,width,height} }` |

---

## API Reference

### Auth (`/api/v1/auth`)

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| POST   | `/register`              | Register new user               |
| POST   | `/login`                 | Login                           |
| POST   | `/refresh`               | Refresh access token            |
| POST   | `/logout`                | Logout                          |
| GET    | `/me/:id`                | Get current user                |
| PATCH  | `/change-password`       | Change password (protected)     |
| POST   | `/forgot-password`       | Request password reset          |
| PATCH  | `/reset-password/:token` | Reset password                  |
| GET    | `/verify-email/:token`   | Verify email                    |
| POST   | `/resend-verification`   | Resend verification (protected) |

### Events (`/api/v1/event`)

| Method | Endpoint        | Description              |
| ------ | --------------- | ------------------------ |
| POST   | `/create-event` | Create event (organizer) |
| GET    | `/`             | List organizer's events  |
| GET    | `/:eventId`     | Get event details        |
| PATCH  | `/:eventId`     | Update event             |
| DELETE | `/:eventId`     | Delete event             |

### Images (`/api/v1/image`)

| Method | Endpoint           | Description                      |
| ------ | ------------------ | -------------------------------- |
| POST   | `/:eventId/images` | Upload event image (organizer)   |
| GET    | `/:eventId/images` | List event images (paginated)    |
| POST   | `/:eventId/match`  | Match selfie against event faces |
| DELETE | `/:imageId`        | Delete image (organizer)         |

### Users (`/api/v1/user`)

| Method | Endpoint          | Description                |
| ------ | ----------------- | -------------------------- |
| GET    | `/:id`            | Get user by ID             |
| PATCH  | `/update-profile` | Update profile (protected) |
| PATCH  | `/update-avatar`  | Upload avatar (protected)  |
| DELETE | `/delete-account` | Delete account (protected) |

---

## Project Structure

```
GrabPick/
├── backend/
│   ├── models/                          # face-api.js model weights
│   │   ├── ssd_mobilenetv1/             # Face detector (primary)
│   │   ├── face_landmark_68/            # 68-point face landmarks
│   │   ├── face_recognition/            # 128-dim face descriptor
│   │   └── tiny_face_detector/          # Lightweight detector (backup)
│   ├── src/
│   │   ├── app.js                       # Express app setup
│   │   ├── server.js                    # Entry point (DB connect + listen)
│   │   ├── config/
│   │   │   ├── db.config.js             # MongoDB connection
│   │   │   ├── env.js                   # Environment variables
│   │   │   └── redis.config.js          # Redis/IORedis connection
│   │   ├── controllers/                 # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── event.controller.js
│   │   │   ├── image.controller.js
│   │   │   ├── match.controller.js
│   │   │   └── user.controller.js
│   │   ├── services/                    # Business logic
│   │   │   ├── auth.service.js
│   │   │   ├── email.service.js
│   │   │   ├── embedding.service.js     # Model loading + face embedding
│   │   │   ├── event.service.js
│   │   │   ├── image.service.js         # Upload processing + face matching
│   │   │   ├── match.service.js
│   │   │   └── user.service.js
│   │   ├── models/                      # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   ├── event.model.js
│   │   │   └── image.model.js
│   │   ├── routes/                      # Express routers
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js        # JWT verification
│   │   │   ├── emailVerify.middleware.js
│   │   │   ├── error.handler.js         # Global error handler
│   │   │   ├── role.middleware.js        # Organizer authorization
│   │   │   └── upload.middleware.js      # Multer (profile + event images)
│   │   ├── errors/
│   │   │   └── app.error.js             # Custom AppError class
│   │   ├── integrations/
│   │   │   ├── cloud.storage.js         # S3 integration (placeholder)
│   │   │   └── ml.client.js             # External ML client (placeholder)
│   │   ├── queues/
│   │   │   └── image.queue.js           # BullMQ queue (placeholder)
│   │   ├── workers/
│   │   │   └── image.worker.js          # BullMQ worker (placeholder)
│   │   ├── utils/
│   │   │   ├── jwt.utils.js
│   │   │   ├── refreshToken.utils.js
│   │   │   ├── email.util.js
│   │   │   └── vector.utils.js          # Euclidean distance, cosine similarity
│   │   └── uploads/
│   │       ├── profile-images/          # User avatars
│   │       └── event-images/            # Event photos
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── store.js                     # Redux store
│   │   ├── index.css                    # Tailwind imports
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── CreateEventPage.jsx
│   │   │   ├── EventsListPage.jsx
│   │   │   ├── EventDetailPage.jsx      # Image upload + gallery
│   │   │   ├── FindPhotosPage.jsx       # Enter event ID
│   │   │   ├── MatchFacePage.jsx        # Selfie upload + results
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   ├── VerifyEmailPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── features/
│   │   │   └── authSlice.js             # Redux auth state
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   ├── api.js                   # Axios instance + interceptors
│   │   │   ├── authService.js
│   │   │   ├── eventService.js
│   │   │   ├── imageService.js
│   │   │   └── userService.js
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   └── utils/
│   │       └── image.js                 # Image URL resolver
│   ├── vite.config.js                   # Dev proxy to backend
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **MongoDB** (local or Atlas)
- **Redis** (local or managed — required for BullMQ)

### 1. Clone

```bash
git clone https://github.com/your-username/GrabPick.git
cd GrabPick
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/grabpick
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
ACCESS_TOKEN_SECRET=your-access-secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES=7d
BASE_URL=http://localhost:5000
EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NODE_ENV=development
```

Start the server:

```bash
npm run dev     # development (nodemon)
npm start       # production
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=/api/v1
VITE_BACKEND_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev     # Vite dev server on :5173
npm run build   # Production build
```

The Vite dev server proxies `/api` and `/uploads` to the backend automatically.

---

## Face Recognition Details

### Models Used

| Model              | Purpose                    | Output                                     |
| ------------------ | -------------------------- | ------------------------------------------ |
| SSD MobileNet v1   | Face detection             | Bounding boxes + confidence scores         |
| FaceLandmark68Net  | Facial landmark detection  | 68 key points (eyes, nose, mouth, jawline) |
| FaceRecognitionNet | Face descriptor extraction | 128-dimensional float vector               |

### Matching Algorithm

- **Metric:** Euclidean distance between 128-dim descriptors
- **Threshold:** 0.6 (same person if distance < 0.6)
- **Per-image logic:** Best (closest) face match is used; only images with at least one face below threshold are returned
- **Ranking:** Results sorted by similarity score (1 − distance)

### Why Euclidean Distance?

face-api.js descriptors are trained with a contrastive loss that optimizes for L2 (Euclidean) distance. The 0.6 threshold is calibrated specifically for this metric. Cosine similarity operates on a different scale and produces weaker separation between true matches and impostors.

---

## Deployment

| Component | Recommended                             |
| --------- | --------------------------------------- |
| Frontend  | Vercel, Netlify                         |
| Backend   | Railway, Render, AWS EC2                |
| Database  | MongoDB Atlas                           |
| Redis     | Redis Cloud, AWS ElastiCache            |
| Storage   | AWS S3, Cloudinary (replace local disk) |

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use managed MongoDB (Atlas) and Redis
- [ ] Replace local file storage with S3/Cloudinary
- [ ] Set secure CORS origins (replace `cors()` wildcard)
- [ ] Enable HTTPS
- [ ] Set strong JWT secrets

---

## Future Enhancements

- [ ] BullMQ background processing for large batch uploads
- [ ] Cloud storage integration (S3/Cloudinary)
- [ ] QR code for instant event joining
- [ ] Photo download (individual + bulk zip)
- [ ] Organizer analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Dedicated vector database for large-scale matching
- [ ] GPU-accelerated face processing

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

**Ramakant Chouhan**
B.Tech Computer Science | Full-Stack & AI Developer

Built with Node.js, React, and face-api.js.
