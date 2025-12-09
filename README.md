# FYC Template for React Projects built with Vite

Please see below these notes for a readme that you can use for your project. 

## Current Status

[![Maintainability](https://api.codeclimate.com/v1/badges/7efff12ae6b4d65a3dcf/maintainability)](https://codeclimate.com/repos/65d6b800671d0200dfc32a2f/maintainability)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/5c8ee693fec2439abaeddef2e5400a69)](https://app.codacy.com/gh/FYC-Labs/app-template-2024-vite-react/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

# UGC Video Quality Analysis

An AI-powered application for analyzing user-generated content (UGC) video quality. Uses OpenAI's GPT-4 Vision and Whisper APIs to evaluate lighting, sharpness, framing, and audio quality.

## Overview

This application provides comprehensive video quality analysis for content creators, social media managers, and video producers. Upload a video and receive detailed scores and recommendations for improving visual and audio quality.

**Key Features:**
- Frame-by-frame video analysis using AI
- Audio quality evaluation
- Detailed scoring (lighting, sharpness, framing, audio)
- Issue detection and categorization
- Secure authentication with Supabase
- Video history management

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (for database, storage, auth)
- OpenAI API key (for analysis)
- FFmpeg (for backend video processing)

### Frontend Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Copy `.env.example` to `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Start Development Server:**
   ```bash
   npm start
   ```

   Frontend runs on http://localhost:5173

### Edge Functions (Deployed Automatically)

The following Supabase Edge Functions are deployed:
- `upload-video` - Generate signed upload URLs
- `videos` - List and delete videos
- `results` - Fetch video analysis results

**Important:** Edge Functions cannot perform video processing (FFmpeg not available). See [VIDEO_PROCESSING_LIMITATION.md](./VIDEO_PROCESSING_LIMITATION.md) for solutions.

## Architecture

- **Frontend:** React + Vite + Bootstrap + Supabase Auth
- **API:** Supabase Edge Functions
- **Database & Storage:** Supabase
- **Hosting:** Firebase (frontend)

**Note:** Video processing (FFmpeg-based frame extraction and OpenAI analysis) requires a separate backend service. The Express.js backend is included in the `/api` folder but must be deployed separately. See [VIDEO_PROCESSING_LIMITATION.md](./VIDEO_PROCESSING_LIMITATION.md) for details and solutions.

## Current Functionality

### ✅ Working Features
- User authentication (Supabase Auth)
- Video upload with signed URLs
- Video list management
- Video deletion with storage cleanup
- Results retrieval for completed analyses
- Database with Row Level Security

### ⚠️ Requires Additional Setup
- **Video Processing**: FFmpeg-based frame extraction and AI analysis requires deploying the Express.js backend from `/api` folder to a service with FFmpeg support (Railway, Render, Fly.io, etc.)

## Usage

1. **Sign Up/Login** - Create account with email and password
2. **Upload Video** - Select video file (max 100MB, MP4/MOV/WebM/AVI/MKV)
3. **Processing** - *Requires backend deployment* - AI analyzes your video
4. **View Results** - Get detailed scores and improvement recommendations
5. **Manage Videos** - Access history, delete videos, download reports

## Documentation

For complete documentation, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

Topics covered:
- Detailed architecture overview
- API endpoints reference
- Scoring system explained
- Cost estimates
- Deployment instructions
- Security considerations
- Troubleshooting guide

## Technology Stack

**Frontend:**
- React 18
- React Router 6
- Bootstrap 5
- Supabase JS Client

**API:**
- Supabase Edge Functions (Deno runtime)

**Backend (Optional - for video processing):**
- Node.js + Express (in `/api` folder)
- FFmpeg (Video processing)
- OpenAI GPT-4 Vision API
- OpenAI Whisper API

**Infrastructure:**
- Supabase (Database, Storage, Auth, Edge Functions)

## Cost Estimates

Approximate OpenAI API costs per video:
- Short video (30s): $0.50 - $1.10
- Medium video (1-2 min): $0.90 - $2.80

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## Issues

If you encounter any issues:
1. Check the troubleshooting section in documentation
2. Review API logs for errors
3. Create an issue with detailed description

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.