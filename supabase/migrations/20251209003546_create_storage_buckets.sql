-- Create Supabase Storage Buckets for Video Analysis
--
-- 1. Storage Buckets
--    - ugc-videos: Main bucket for video files and extracted audio (Private, 100MB limit)
--    - ugc-frames: Bucket for extracted video frames (Public read, 5MB limit)
--
-- 2. Storage Policies
--    - Users can upload to videos/{user_id}/* path
--    - Users can read their own videos
--    - Anyone can read frames (for thumbnail display)
--    - Users can upload frames to their own folders
--
-- 3. Folder Structure
--    - videos/{user_id}/{video_id}/video.mp4
--    - videos/{user_id}/{video_id}/audio.wav
--    - frames/{user_id}/{video_id}/frame_XXXX.jpg

-- Create ugc-videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ugc-videos',
  'ugc-videos',
  false,
  104857600,
  ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-matroska', 'audio/wav', 'audio/wave']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 104857600,
  allowed_mime_types = ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-matroska', 'audio/wav', 'audio/wave'];

-- Create ugc-frames bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ugc-frames',
  'ugc-frames',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png'];

-- Storage policies for ugc-videos bucket
CREATE POLICY "Users can upload to own folder in ugc-videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'ugc-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read own videos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'ugc-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'ugc-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'ugc-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'ugc-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policies for ugc-frames bucket
CREATE POLICY "Users can upload frames to own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'ugc-frames' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Anyone can read frames"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'ugc-frames');

CREATE POLICY "Users can update own frames"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'ugc-frames' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'ugc-frames' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own frames"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'ugc-frames' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );