# UGC Video Quality Analysis API

This is the backend API for the UGC Video Quality Analysis application. It provides endpoints for video upload, processing, and quality analysis using OpenAI Vision and Whisper APIs.

## Features

- Video upload with signed URLs (Supabase Storage)
- Frame-by-frame video quality analysis using GPT-4 Vision
- Audio transcription and quality analysis using Whisper
- Comprehensive scoring system for lighting, sharpness, framing, and audio
- Secure authentication using Supabase Auth
- Row Level Security for data access control

## Prerequisites

- Node.js 18+ installed
- FFmpeg installed on the server
- Supabase project with database and storage configured
- OpenAI API key

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Copy `.env.example` to `.env` and fill in the required values:

```env
PORT=3001
NODE_ENV=development

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

OPENAI_API_KEY=your_openai_api_key

FRONTEND_URL=http://localhost:5173
```

3. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication Required Endpoints

All endpoints below require a Bearer token in the Authorization header:
```
Authorization: Bearer <supabase_access_token>
```

### Video Upload
- `POST /api/upload-url` - Get signed upload URL
  - Body: `{ filename, filesize, mimetype }`
  - Returns: `{ video_id, upload_url, file_path, bucket, token, expires_at }`

### Video Processing
- `POST /api/process` - Start video analysis
  - Body: `{ video_id }`
  - Returns: `{ message, video_id, status }`

### Results
- `GET /api/results/:videoId` - Get analysis results
  - Query params: `include_frames=true` (optional)
  - Returns: Complete analysis with scores and issues

### Video Management
- `GET /api/videos` - List user's videos
  - Query params: `status`, `limit`, `offset`
  - Returns: `{ videos, total }`

- `DELETE /api/videos/:videoId` - Delete video and all associated data

## Video Processing Pipeline

1. Video is uploaded to Supabase Storage
2. FFmpeg extracts frames (1 fps for short videos, 0.5 fps for longer ones)
3. FFmpeg extracts audio track
4. Each frame is analyzed with GPT-4 Vision for:
   - Lighting quality (1-10)
   - Sharpness/focus (1-10)
   - Framing/composition (1-10)
5. Audio is transcribed with Whisper and analyzed with GPT-4
6. Scores are aggregated and categorized issues are identified
7. Final score calculation: (video_quality * 0.6) + (audio_quality * 0.4)

## Cost Estimates

Approximate OpenAI API costs per video:
- Short video (30s, ~30 frames): $0.50 - $1.00
- Medium video (1-2 min, ~60-120 frames): $1.00 - $2.00
- Audio analysis: ~$0.10 - $0.30

Total cost per video: $0.60 - $2.30

## Deployment

This API can be deployed to:
- Railway
- Render
- Heroku
- Any Node.js hosting platform with FFmpeg support

Make sure FFmpeg is available in the deployment environment. Most platforms provide it via buildpacks or Docker images.

## Error Handling

The API returns standard HTTP status codes:
- 200: Success
- 202: Accepted (processing in progress)
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Internal server error

## Security

- All endpoints (except health check) require authentication
- Row Level Security policies ensure users can only access their own data
- Signed URLs for storage uploads expire after 1 hour
- Videos are isolated by user folders in storage
- Service role key is never exposed to frontend

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## License

MIT
