import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '../index.js';
import { authenticateUser } from '../index.js';

const router = express.Router();

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo',
  'video/x-matroska'
];

const MAX_FILE_SIZE = 100 * 1024 * 1024;

router.post('/upload-url', authenticateUser, async (req, res) => {
  try {
    const { filename, filesize, mimetype } = req.body;
    const userId = req.userId;

    if (!filename || !filesize || !mimetype) {
      return res.status(400).json({ error: 'Missing required fields: filename, filesize, mimetype' });
    }

    if (!ALLOWED_VIDEO_TYPES.includes(mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Allowed types: mp4, mov, webm, avi, mkv' });
    }

    if (filesize > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File size exceeds maximum limit of 100MB' });
    }

    const videoId = uuidv4();
    const fileExtension = filename.split('.').pop();
    const filePath = `${userId}/${videoId}/video.${fileExtension}`;

    const { data: videoRecord, error: dbError } = await supabaseAdmin
      .from('videos')
      .insert({
        id: videoId,
        user_id: userId,
        original_filename: filename,
        file_path: filePath,
        storage_bucket: 'ugc-videos',
        status: 'pending_upload'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to create video record' });
    }

    const { data: signedUrlData, error: urlError } = await supabaseAdmin
      .storage
      .from('ugc-videos')
      .createSignedUploadUrl(filePath);

    if (urlError) {
      console.error('Storage error:', urlError);
      await supabaseAdmin.from('videos').delete().eq('id', videoId);
      return res.status(500).json({ error: 'Failed to generate upload URL' });
    }

    return res.json({
      video_id: videoId,
      upload_url: signedUrlData.signedUrl,
      file_path: filePath,
      bucket: 'ugc-videos',
      token: signedUrlData.token,
      expires_at: new Date(Date.now() + 3600000).toISOString()
    });

  } catch (error) {
    console.error('Upload URL error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/videos', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { status, limit = 20, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from('videos')
      .select('*, video_analysis(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: videos, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch videos' });
    }

    return res.json({ videos, total: videos.length });

  } catch (error) {
    console.error('Fetch videos error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/videos/:videoId', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { videoId } = req.params;

    const { data: video, error: fetchError } = await supabaseAdmin
      .from('videos')
      .select('file_path, user_id')
      .eq('id', videoId)
      .single();

    if (fetchError || !video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const folderPath = `${userId}/${videoId}`;

    const { data: files } = await supabaseAdmin
      .storage
      .from('ugc-videos')
      .list(folderPath);

    if (files && files.length > 0) {
      const filesToDelete = files.map(file => `${folderPath}/${file.name}`);
      await supabaseAdmin.storage.from('ugc-videos').remove(filesToDelete);
    }

    const { data: frames } = await supabaseAdmin
      .storage
      .from('ugc-frames')
      .list(folderPath);

    if (frames && frames.length > 0) {
      const framesToDelete = frames.map(frame => `${folderPath}/${frame.name}`);
      await supabaseAdmin.storage.from('ugc-frames').remove(framesToDelete);
    }

    const { error: deleteError } = await supabaseAdmin
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return res.status(500).json({ error: 'Failed to delete video' });
    }

    return res.json({ message: 'Video deleted successfully' });

  } catch (error) {
    console.error('Delete video error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
