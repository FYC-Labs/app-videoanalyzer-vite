# Video Processing Limitation with Supabase Edge Functions

## Critical Limitation

**Supabase Edge Functions cannot perform video processing because they do not have FFmpeg available.**

The current implementation uses Edge Functions for:
- ✅ Video upload URL generation
- ✅ Video list/delete operations
- ✅ Results retrieval
- ❌ **Video processing (FFmpeg frame extraction and analysis)**

## Why Video Processing Cannot Work in Edge Functions

1. **No FFmpeg**: Edge Functions don't have FFmpeg or any video processing libraries installed
2. **No File System Access**: Limited `/tmp` storage and no persistent file system
3. **Execution Time Limits**: Edge Functions have a maximum execution time (typically 150 seconds)
4. **Memory Constraints**: Video processing requires significant memory for frame extraction

## Current State

The frontend will throw an error when trying to process a video:
```
Video processing is not available via Edge Functions. FFmpeg video processing requires a separate backend service with FFmpeg installed.
```

## Solutions to Enable Video Processing

### Option 1: Deploy Separate Backend Service (Recommended)

Keep the Express.js backend in the `/api` folder and deploy it separately:

**Backend Options:**
- **Railway**: Easy deployment with FFmpeg support
- **Render**: Free tier available, FFmpeg via buildpack
- **Fly.io**: Docker support for FFmpeg
- **DigitalOcean App Platform**: FFmpeg available
- **Heroku**: FFmpeg via buildpack

**Setup Steps:**
1. Deploy the Express.js API from `/api` folder
2. Update frontend `.env`:
   ```env
   VITE_API_BASE_URL=https://your-backend-url.com
   ```
3. Update `src/utils/apiClient.js` to use hybrid approach:
   - Edge Functions for: upload URL, videos list/delete, results
   - Backend API for: video processing

**Hybrid API Client Example:**
```javascript
class ApiClient {
  constructor() {
    this.edgeFunctionsUrl = `${SUPABASE_URL}/functions/v1`;
    this.backendUrl = import.meta.env.VITE_API_BASE_URL;
  }

  async processVideo(videoId) {
    // Use backend API for processing
    return this.post(`${this.backendUrl}/api/process`, {
      video_id: videoId
    });
  }

  async uploadVideo(file) {
    // Use Edge Function for upload URL
    return this.post(`${this.edgeFunctionsUrl}/upload-video`, {
      filename: file.name,
      filesize: file.size,
      mimetype: file.type
    });
  }
}
```

### Option 2: Use Third-Party Video Processing Service

Integrate with a specialized video processing service:

**Options:**
- **Cloudinary**: Video transformation and analysis
- **Mux**: Video streaming and analysis APIs
- **AWS Lambda** with FFmpeg layer
- **Google Cloud Functions** with FFmpeg
- **Azure Functions** with custom container

**Pros:**
- No server management
- Scalable
- Global CDN

**Cons:**
- Additional costs
- Learning curve
- Third-party dependency

### Option 3: Client-Side Processing (Limited)

Use browser-based video processing:

**Libraries:**
- **ffmpeg.wasm**: FFmpeg compiled to WebAssembly
- **MediaRecorder API**: For basic frame extraction
- **Canvas API**: For frame analysis

**Example:**
```javascript
import { createFFmpeg } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });
await ffmpeg.load();

// Extract frames
ffmpeg.FS('writeFile', 'input.mp4', videoData);
await ffmpeg.run('-i', 'input.mp4', '-vf', 'fps=1', 'frame_%04d.jpg');
```

**Pros:**
- No backend needed
- Privacy (files never leave user's browser)

**Cons:**
- Large library size (~25MB)
- Performance depends on user's device
- OpenAI API calls still needed from backend
- Limited browser memory

### Option 4: Supabase Database Functions (Not Recommended)

While technically possible to trigger processing from database functions, this approach:
- Still lacks FFmpeg
- Has execution time limits
- Cannot handle file processing
- **Not suitable for video processing**

## Recommended Architecture

```
┌─────────────┐
│   Frontend  │
│   (React)   │
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌──────────────┐   ┌─────────────────┐
│   Supabase   │   │  Backend API    │
│    Edge      │   │  (Express.js)   │
│  Functions   │   │  with FFmpeg    │
└──────────────┘   └─────────────────┘
       │                  │
       │                  │
       ▼                  ▼
┌─────────────────────────────┐
│    Supabase Database        │
│    & Storage                │
└─────────────────────────────┘
```

**Responsibilities:**
- **Edge Functions**: Quick operations (upload URLs, data retrieval)
- **Backend API**: Heavy processing (FFmpeg, OpenAI calls)
- **Supabase**: Data persistence and storage

## Implementation Steps for Hybrid Approach

1. **Deploy Backend API**:
   ```bash
   cd api
   # Deploy to Railway, Render, or other platform
   ```

2. **Update Frontend Environment**:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_API_BASE_URL=https://your-backend-api.com
   ```

3. **Modify API Client** (`src/utils/apiClient.js`):
   ```javascript
   const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
   const EDGE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

   async processVideo(videoId) {
     // Route to backend API
     const response = await fetch(`${BACKEND_URL}/api/process`, {
       method: 'POST',
       headers: await this.getHeaders(),
       body: JSON.stringify({ video_id: videoId })
     });
     return response.json();
   }
   ```

4. **Backend Deployment Checklist**:
   - [ ] FFmpeg installed
   - [ ] Environment variables configured
   - [ ] CORS configured for frontend domain
   - [ ] Health check endpoint working
   - [ ] Test video processing end-to-end

## Cost Comparison

### Edge Functions Only (Current State)
- ✅ Free tier: 500K invocations/month
- ❌ Cannot process videos

### Hybrid (Edge Functions + Backend)
- Edge Functions: Free tier sufficient
- Backend API:
  - Railway: $5-10/month
  - Render: Free tier available (limitations apply)
  - Fly.io: Pay per use (~$5-15/month)
- OpenAI API: $0.50-$2.80 per video

### Total Monthly Cost
- Minimal usage (10-50 videos): $5-20/month
- Medium usage (100-500 videos): $50-300/month

## Testing Video Processing Locally

Since Edge Functions can't process videos, you need the Express.js backend running:

```bash
# Terminal 1: Run backend
cd api
npm install
npm run dev

# Terminal 2: Run frontend
npm start
```

Then update `src/utils/apiClient.js` to use `http://localhost:3001` for processing endpoint.

## Conclusion

**Video processing with Edge Functions alone is not possible.** You must choose one of the solutions above:

1. **Best for production**: Hybrid approach (Edge Functions + Backend API)
2. **Best for cost**: Client-side processing with ffmpeg.wasm (with limitations)
3. **Best for scale**: Third-party video processing service

The `/api` folder contains a fully functional Express.js backend ready to deploy for video processing.
