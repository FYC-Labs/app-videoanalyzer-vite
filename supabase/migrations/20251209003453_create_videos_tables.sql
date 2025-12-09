/*
  # Create UGC Video Analysis Database Schema

  1. New Tables
    - `videos`
      - `id` (uuid, primary key) - Unique video identifier
      - `user_id` (uuid, references auth.users) - Owner of the video
      - `original_filename` (text) - Original file name from upload
      - `file_path` (text) - Path in Supabase Storage
      - `storage_bucket` (text) - Storage bucket name
      - `status` (text) - Processing status: pending_upload, processing, completed, failed, timeout
      - `error_message` (text, nullable) - Error details if failed
      - `processing_started_at` (timestamptz, nullable) - When processing began
      - `processing_completed_at` (timestamptz, nullable) - When processing finished
      - `created_at` (timestamptz) - Upload timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `video_analysis`
      - `id` (uuid, primary key) - Analysis record ID
      - `video_id` (uuid, references videos) - Video being analyzed
      - `lighting_score` (numeric) - Average lighting score 1-10
      - `sharpness_score` (numeric) - Average sharpness score 1-10
      - `framing_score` (numeric) - Average framing score 1-10
      - `audio_score` (numeric, nullable) - Audio quality score 1-10
      - `final_score` (numeric) - Overall quality score 1-10
      - `issues` (jsonb) - Categorized issues array
      - `frame_count` (integer) - Total frames analyzed
      - `duration` (numeric) - Video duration in seconds
      - `processing_started_at` (timestamptz) - Analysis start time
      - `processing_completed_at` (timestamptz) - Analysis end time
      - `created_at` (timestamptz) - Record creation timestamp

    - `video_frames`
      - `id` (uuid, primary key) - Frame record ID
      - `video_id` (uuid, references videos) - Parent video
      - `frame_number` (integer) - Frame sequence number
      - `frame_path` (text) - Path to frame image in storage
      - `lighting` (numeric) - Lighting score for this frame
      - `sharpness` (numeric) - Sharpness score for this frame
      - `framing` (numeric) - Framing score for this frame
      - `overall` (numeric) - Overall frame score
      - `issues` (jsonb) - Issues detected in this frame
      - `timestamp` (numeric) - Frame timestamp in video (seconds)
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on all tables
    - Users can only access their own videos
    - Policies for SELECT, INSERT, UPDATE, DELETE operations
    - Authenticated users only

  3. Indexes
    - Index on videos.user_id for user video queries
    - Index on videos.status for filtering
    - Index on video_analysis.video_id for lookups
    - Index on video_frames.video_id for frame retrieval
*/

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_filename text NOT NULL,
  file_path text NOT NULL,
  storage_bucket text NOT NULL DEFAULT 'ugc-videos',
  status text NOT NULL DEFAULT 'pending_upload',
  error_message text,
  processing_started_at timestamptz,
  processing_completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create video_analysis table
CREATE TABLE IF NOT EXISTS video_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  lighting_score numeric(3,1),
  sharpness_score numeric(3,1),
  framing_score numeric(3,1),
  audio_score numeric(3,1),
  final_score numeric(3,1),
  issues jsonb DEFAULT '[]'::jsonb,
  frame_count integer DEFAULT 0,
  duration numeric(10,2),
  processing_started_at timestamptz,
  processing_completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(video_id)
);

-- Create video_frames table
CREATE TABLE IF NOT EXISTS video_frames (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  frame_number integer NOT NULL,
  frame_path text NOT NULL,
  lighting numeric(3,1),
  sharpness numeric(3,1),
  framing numeric(3,1),
  overall numeric(3,1),
  issues jsonb DEFAULT '[]'::jsonb,
  timestamp numeric(10,2),
  created_at timestamptz DEFAULT now(),
  UNIQUE(video_id, frame_number)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_video_analysis_video_id ON video_analysis(video_id);
CREATE INDEX IF NOT EXISTS idx_video_frames_video_id ON video_frames(video_id);

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_frames ENABLE ROW LEVEL SECURITY;

-- RLS Policies for videos table
CREATE POLICY "Users can view own videos"
  ON videos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos"
  ON videos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for video_analysis table
CREATE POLICY "Users can view own video analysis"
  ON video_analysis FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_analysis.video_id
      AND videos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own video analysis"
  ON video_analysis FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_analysis.video_id
      AND videos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own video analysis"
  ON video_analysis FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_analysis.video_id
      AND videos.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_analysis.video_id
      AND videos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own video analysis"
  ON video_analysis FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_analysis.video_id
      AND videos.user_id = auth.uid()
    )
  );

-- RLS Policies for video_frames table
CREATE POLICY "Users can view own video frames"
  ON video_frames FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_frames.video_id
      AND videos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own video frames"
  ON video_frames FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_frames.video_id
      AND videos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own video frames"
  ON video_frames FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_frames.video_id
      AND videos.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_frames.video_id
      AND videos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own video frames"
  ON video_frames FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_frames.video_id
      AND videos.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for videos table
DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();