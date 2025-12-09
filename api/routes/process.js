import express from 'express';
import { supabaseAdmin } from '../index.js';
import { authenticateUser } from '../index.js';
import { processVideo } from '../services/videoProcessor.js';

const router = express.Router();

router.post('/process', authenticateUser, async (req, res) => {
  try {
    const { video_id } = req.body;
    const userId = req.userId;

    if (!video_id) {
      return res.status(400).json({ error: 'Missing required field: video_id' });
    }

    const { data: video, error: fetchError } = await supabaseAdmin
      .from('videos')
      .select('*')
      .eq('id', video_id)
      .single();

    if (fetchError || !video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (video.status === 'processing') {
      return res.status(400).json({ error: 'Video is already being processed' });
    }

    if (video.status === 'completed') {
      return res.status(400).json({ error: 'Video has already been processed' });
    }

    const { error: updateError } = await supabaseAdmin
      .from('videos')
      .update({
        status: 'processing',
        processing_started_at: new Date().toISOString()
      })
      .eq('id', video_id);

    if (updateError) {
      console.error('Update error:', updateError);
      return res.status(500).json({ error: 'Failed to update video status' });
    }

    processVideo(video_id, userId, video.file_path).catch(error => {
      console.error('Video processing error:', error);
    });

    return res.json({
      message: 'Video processing started',
      video_id: video_id,
      status: 'processing'
    });

  } catch (error) {
    console.error('Process endpoint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/results/:videoId', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { videoId } = req.params;
    const { include_frames } = req.query;

    const { data: video, error: videoError } = await supabaseAdmin
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (video.status === 'pending_upload') {
      return res.status(400).json({ error: 'Video has not been uploaded yet' });
    }

    if (video.status === 'processing') {
      const { data: analysis } = await supabaseAdmin
        .from('video_analysis')
        .select('frame_count')
        .eq('video_id', videoId)
        .maybeSingle();

      const { count: processedFrames } = await supabaseAdmin
        .from('video_frames')
        .select('*', { count: 'exact', head: true })
        .eq('video_id', videoId);

      const totalFrames = analysis?.frame_count || 0;
      const progress = totalFrames > 0 ? Math.round((processedFrames / totalFrames) * 100) : 0;

      return res.status(202).json({
        video_id: videoId,
        status: 'processing',
        progress: progress,
        message: 'Video is still being processed'
      });
    }

    if (video.status === 'failed') {
      return res.status(500).json({
        video_id: videoId,
        status: 'failed',
        error_message: video.error_message || 'Processing failed'
      });
    }

    const { data: analysis, error: analysisError } = await supabaseAdmin
      .from('video_analysis')
      .select('*')
      .eq('video_id', videoId)
      .maybeSingle();

    if (analysisError) {
      console.error('Analysis fetch error:', analysisError);
      return res.status(500).json({ error: 'Failed to fetch analysis data' });
    }

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis data not found' });
    }

    const processingTime = video.processing_completed_at && video.processing_started_at
      ? Math.round((new Date(video.processing_completed_at) - new Date(video.processing_started_at)) / 1000)
      : null;

    const response = {
      video_id: videoId,
      filename: video.original_filename,
      status: video.status,
      scores: {
        lighting: analysis.lighting_score,
        sharpness: analysis.sharpness_score,
        framing: analysis.framing_score,
        audio: analysis.audio_score,
        final: analysis.final_score
      },
      issues: analysis.issues || {},
      metadata: {
        frame_count: analysis.frame_count,
        duration: analysis.duration,
        processing_time: processingTime
      },
      created_at: video.created_at,
      processing_completed_at: video.processing_completed_at
    };

    if (include_frames === 'true') {
      const { data: frames, error: framesError } = await supabaseAdmin
        .from('video_frames')
        .select('*')
        .eq('video_id', videoId)
        .order('frame_number', { ascending: true });

      if (!framesError && frames) {
        response.frames = frames;
      }
    }

    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.json(response);

  } catch (error) {
    console.error('Results endpoint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
