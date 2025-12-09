# UGC Video Quality Analysis Application

A comprehensive application for analyzing user-generated content (UGC) video quality using AI-powered analysis. The system evaluates lighting, sharpness, framing composition, and audio quality using OpenAI's GPT-4 Vision and Whisper APIs.

## Architecture Overview

### Technology Stack

**Frontend:**
- React 18 with React Router
- Bootstrap 5 and React Bootstrap for UI
- Supabase Auth for authentication
- Vite for build tooling

**Backend:**
- Node.js with Express.js
- Supabase for database, storage, and authentication
- FFmpeg for video/audio processing
- OpenAI GPT-4 Vision API for frame analysis
- OpenAI Whisper API for audio transcription and analysis

**Infrastructure:**
- Supabase: Database, Storage, and Authentication
- Firebase: Frontend hosting only
- Backend: Can be deployed to Railway, Render, Heroku, or any Node.js platform

### Key Features

1. **Secure Authentication**
   - Supabase email/password authentication
   - Row Level Security (RLS) for data protection
   - JWT token-based API authentication

2. **Video Upload & Storage**
   - Direct upload to Supabase Storage with signed URLs
   - Support for MP4, MOV, WebM, AVI, MKV formats
   - 100MB file size limit
   - Automatic file organization by user and video ID

3. **AI-Powered Analysis**
   - Frame-by-frame analysis using GPT-4 Vision
   - Evaluates: lighting (1-10), sharpness (1-10), framing (1-10)
   - Audio transcription and quality analysis with Whisper
   - Comprehensive issue detection and categorization

4. **User Dashboard**
   - Video upload interface with preview
   - Real-time processing status with progress tracking
   - Detailed results with scores and recommendations
   - Video history management

## Project Structure

```
project/
├── api/                          # Backend API
│   ├── routes/
│   │   ├── upload.js            # Upload endpoints
│   │   └── process.js           # Processing endpoints
│   ├── services/
│   │   └── videoProcessor.js    # Video processing pipeline
│   ├── index.js                 # Express server
│   ├── package.json
│   └── .env
├── src/                          # Frontend React app
│   ├── components/
│   │   ├── views/
│   │   │   ├── VideoUpload/     # Upload page
│   │   │   ├── VideoProcessing/ # Processing status page
│   │   │   ├── VideoResults/    # Results display page
│   │   │   └── MyVideos/        # Video history page
│   │   └── global/              # Shared components
│   ├── utils/
│   │   ├── supabaseClient.js    # Supabase client
│   │   ├── supabaseAuth.js      # Auth utilities
│   │   └── apiClient.js         # API client
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # App entry point
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

1. **Supabase Project**
   - Create a project at https://supabase.com
   - Note down your Project URL and API keys

2. **OpenAI API Key**
   - Get an API key from https://platform.openai.com
   - Ensure you have credits for GPT-4 and Whisper API

3. **Development Environment**
   - Node.js 18+
   - FFmpeg installed (for backend processing)

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment (.env):
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:3001
```

3. Start development server:
```bash
npm start
```

The app will be available at http://localhost:5173

### Backend Setup

1. Navigate to api directory:
```bash
cd api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment (api/.env):
```env
PORT=3001
NODE_ENV=development

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

OPENAI_API_KEY=your_openai_api_key

FRONTEND_URL=http://localhost:5173
```

4. Start the API server:
```bash
npm run dev
```

The API will be available at http://localhost:3001

### Database Setup

The database schema and storage buckets are automatically created via Supabase migrations. The migrations include:

1. **Tables:**
   - `videos` - Video records and metadata
   - `video_analysis` - Analysis results and scores
   - `video_frames` - Frame-by-frame analysis data

2. **Storage Buckets:**
   - `ugc-videos` - Private bucket for video files and audio
   - `ugc-frames` - Public bucket for extracted frames

3. **Security:**
   - Row Level Security enabled on all tables
   - Users can only access their own data
   - Storage policies restrict access to user-specific folders

## User Flow

### 1. Authentication
- User signs up with email and password
- Supabase handles authentication and session management
- JWT token is stored for API requests

### 2. Video Upload
1. Navigate to `/upload`
2. Select video file (max 100MB)
3. Preview video and view metadata
4. Click "Upload & Analyze"
5. Video uploads to Supabase Storage
6. Processing begins automatically

### 3. Processing
1. Backend downloads video from storage
2. FFmpeg extracts frames (1 fps or 0.5 fps based on duration)
3. FFmpeg extracts audio track
4. Each frame analyzed by GPT-4 Vision:
   - Lighting quality
   - Sharpness/focus
   - Framing/composition
   - Issues detected
5. Audio analyzed by Whisper + GPT-4:
   - Transcription
   - Clarity assessment
   - Background noise evaluation
6. Scores aggregated and saved

### 4. Results
- Overall quality score (1-10)
- Individual category scores
- Categorized issues list
- Video metadata and processing stats
- Download analysis report (JSON)

### 5. Video Management
- View all uploaded videos
- Filter by status (completed, processing, failed)
- Access results for completed videos
- Delete videos and associated data

## API Endpoints

### Authentication
All endpoints require `Authorization: Bearer <token>` header except `/api/health`

### Endpoints

**Health Check**
```
GET /api/health
```

**Upload Video**
```
POST /api/upload-url
Body: { filename, filesize, mimetype }
Response: { video_id, upload_url, file_path, bucket, token }
```

**Process Video**
```
POST /api/process
Body: { video_id }
Response: { message, video_id, status }
```

**Get Results**
```
GET /api/results/:videoId?include_frames=true
Response: { video_id, filename, status, scores, issues, metadata }
```

**List Videos**
```
GET /api/videos?status=completed&limit=20&offset=0
Response: { videos, total }
```

**Delete Video**
```
DELETE /api/videos/:videoId
Response: { message }
```

## Scoring System

### Individual Scores (1-10)
- **Lighting:** Exposure, brightness, consistency
- **Sharpness:** Focus quality, clarity
- **Framing:** Composition, subject placement
- **Audio:** Clarity, noise levels, distortion (if audio present)

### Final Score Calculation
```
video_quality = (lighting + sharpness + framing) / 3

If audio exists:
  final_score = (video_quality * 0.6) + (audio_score * 0.4)
Else:
  final_score = video_quality
```

### Score Interpretation
- **8.0 - 10.0:** Excellent quality
- **5.0 - 7.9:** Good quality
- **0.0 - 4.9:** Needs improvement

## Cost Estimates

### OpenAI API Costs (per video)

**GPT-4 Vision (Frame Analysis):**
- 30-second video (~30 frames): $0.40 - $0.80
- 1-minute video (~60 frames): $0.80 - $1.50
- 2-minute video (~120 frames): $1.50 - $2.50

**Whisper API (Audio):**
- Per video: $0.10 - $0.30

**Total Cost per Video:**
- Short (30s): $0.50 - $1.10
- Medium (1-2 min): $0.90 - $2.80
- Total monthly (100 videos): $50 - $280

## Deployment

### Frontend (Firebase Hosting)

1. Build the frontend:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy --only hosting
```

### Backend (Railway/Render/Heroku)

1. Ensure FFmpeg is available (via buildpack or Docker)
2. Set environment variables in platform dashboard
3. Deploy from Git repository or Docker container

**Required Environment Variables:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `FRONTEND_URL`
- `PORT`

### Database (Supabase)

No additional deployment needed. Migrations are applied automatically.

## Security Considerations

### Authentication
- JWT tokens expire and refresh automatically
- Service role key never exposed to frontend
- All API endpoints require authentication

### Data Access
- Row Level Security (RLS) on all tables
- Users can only access their own videos
- Storage organized by user folders
- Signed URLs expire after 1 hour

### File Upload
- File type validation
- File size limits (100MB)
- Virus scanning recommended for production

## Performance Optimization

### Frontend
- Lazy loading of video analysis pages
- Progress tracking during processing
- Cached results for completed analyses

### Backend
- Adaptive frame extraction (fewer frames for longer videos)
- Image resizing before Vision API calls
- Concurrent frame analysis with rate limiting
- Automatic cleanup of temporary files

### Database
- Indexed queries for user videos
- Pagination for video lists
- Optimized joins for analysis data

## Troubleshooting

### Common Issues

**Video upload fails:**
- Check file size (max 100MB)
- Verify file type is supported
- Check Supabase storage quota

**Processing timeout:**
- Videos over 5 minutes may timeout
- Check FFmpeg is installed on server
- Verify OpenAI API key is valid

**Analysis errors:**
- Check OpenAI API credits
- Verify API key has access to GPT-4 and Whisper
- Check backend logs for detailed errors

**Authentication issues:**
- Clear browser cache and cookies
- Check Supabase project settings
- Verify environment variables are set

## Future Enhancements

- [ ] Support for longer videos (chunked processing)
- [ ] Batch video upload
- [ ] Comparison between multiple videos
- [ ] Export reports as PDF
- [ ] Video editing recommendations
- [ ] Mobile app
- [ ] Real-time collaboration
- [ ] Custom scoring weights
- [ ] Integration with video platforms (YouTube, Vimeo)
- [ ] Advanced analytics dashboard

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation in `/api/README.md`
3. Check Supabase and OpenAI documentation
4. Open an issue on GitHub (if applicable)
