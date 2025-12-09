import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';
import OpenAI from 'openai';
import { supabaseAdmin } from '../index.js';

const execPromise = promisify(exec);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const TEMP_DIR = '/tmp/video-processing';
const MAX_PROCESSING_TIME = 600000;

async function ensureTempDir() {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create temp directory:', error);
  }
}

async function downloadVideo(videoPath, localPath) {
  const { data, error } = await supabaseAdmin
    .storage
    .from('ugc-videos')
    .download(videoPath);

  if (error) throw error;

  const buffer = Buffer.from(await data.arrayBuffer());
  await fs.writeFile(localPath, buffer);
}

async function getVideoMetadata(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);

      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      const audioStream = metadata.streams.find(s => s.codec_type === 'audio');

      resolve({
        duration: metadata.format.duration,
        width: videoStream?.width,
        height: videoStream?.height,
        fps: eval(videoStream?.r_frame_rate || '0'),
        hasAudio: !!audioStream,
        codec: videoStream?.codec_name
      });
    });
  });
}

async function extractFrames(videoPath, outputDir, fps = 1) {
  await fs.mkdir(outputDir, { recursive: true });

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions([
        `-vf fps=${fps}`,
        '-q:v 2'
      ])
      .output(path.join(outputDir, 'frame_%04d.jpg'))
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });
}

async function extractAudio(videoPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions([
        '-vn',
        '-acodec pcm_s16le',
        '-ar 16000',
        '-ac 1'
      ])
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });
}

async function analyzeFrameWithVision(framePath, frameNumber) {
  try {
    const imageBuffer = await fs.readFile(framePath);
    const base64Image = imageBuffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this UGC video frame quality. Rate lighting (1-10), sharpness/focus (1-10), framing/composition (1-10). Identify specific issues. Return JSON only with this exact structure: {"lighting": number, "sharpness": number, "framing": number, "overall": number, "issues": string[]}'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: 'low'
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      lighting: parseFloat(result.lighting) || 5,
      sharpness: parseFloat(result.sharpness) || 5,
      framing: parseFloat(result.framing) || 5,
      overall: parseFloat(result.overall) || 5,
      issues: Array.isArray(result.issues) ? result.issues : []
    };

  } catch (error) {
    console.error(`Frame ${frameNumber} analysis error:`, error);
    return {
      lighting: 5,
      sharpness: 5,
      framing: 5,
      overall: 5,
      issues: ['Analysis failed']
    };
  }
}

async function analyzeAudioWithWhisper(audioPath) {
  try {
    const audioFile = await fs.readFile(audioPath);
    const audioBlob = new Blob([audioFile]);

    const transcription = await openai.audio.transcriptions.create({
      file: audioBlob,
      model: 'whisper-1'
    });

    const transcript = transcription.text;

    if (!transcript || transcript.trim().length === 0) {
      return {
        clarity: null,
        noise: null,
        distortion: null,
        overall: null,
        issues: ['No audio detected']
      };
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `Evaluate this UGC video audio quality from transcript: "${transcript}". Rate clarity (1-10), background noise (1-10 where 10=clean), distortion (1-10 where 10=none). Return JSON only: {"clarity": number, "noise": number, "distortion": number, "overall": number, "issues": string[]}`
        }
      ],
      max_tokens: 300,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      clarity: parseFloat(result.clarity) || 5,
      noise: parseFloat(result.noise) || 5,
      distortion: parseFloat(result.distortion) || 5,
      overall: parseFloat(result.overall) || 5,
      issues: Array.isArray(result.issues) ? result.issues : []
    };

  } catch (error) {
    console.error('Audio analysis error:', error);
    return {
      clarity: null,
      noise: null,
      distortion: null,
      overall: null,
      issues: ['Audio analysis failed']
    };
  }
}

async function uploadFrameToStorage(framePath, userId, videoId, frameNumber) {
  const frameBuffer = await fs.readFile(framePath);
  const storagePath = `${userId}/${videoId}/frame_${String(frameNumber).padStart(4, '0')}.jpg`;

  const { error } = await supabaseAdmin
    .storage
    .from('ugc-frames')
    .upload(storagePath, frameBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) throw error;

  return storagePath;
}

async function cleanupTempFiles(dir) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

export async function processVideo(videoId, userId, filePath) {
  const workDir = path.join(TEMP_DIR, videoId);
  const videoPath = path.join(workDir, 'video.mp4');
  const framesDir = path.join(workDir, 'frames');
  const audioPath = path.join(workDir, 'audio.wav');

  const timeoutId = setTimeout(async () => {
    await supabaseAdmin
      .from('videos')
      .update({
        status: 'timeout',
        error_message: 'Processing exceeded maximum time limit',
        processing_completed_at: new Date().toISOString()
      })
      .eq('id', videoId);

    await cleanupTempFiles(workDir);
  }, MAX_PROCESSING_TIME);

  try {
    await ensureTempDir();
    await fs.mkdir(workDir, { recursive: true });

    await downloadVideo(filePath, videoPath);

    const metadata = await getVideoMetadata(videoPath);
    const fps = metadata.duration > 60 ? 0.5 : 1;

    await extractFrames(videoPath, framesDir, fps);

    const frameFiles = await fs.readdir(framesDir);
    const totalFrames = frameFiles.length;

    await supabaseAdmin
      .from('video_analysis')
      .insert({
        video_id: videoId,
        frame_count: totalFrames,
        duration: metadata.duration,
        processing_started_at: new Date().toISOString()
      });

    const frameAnalysisResults = [];

    for (let i = 0; i < frameFiles.length; i++) {
      const frameFile = frameFiles[i];
      const framePath = path.join(framesDir, frameFile);
      const frameNumber = i + 1;

      const analysis = await analyzeFrameWithVision(framePath, frameNumber);

      const storagePath = await uploadFrameToStorage(framePath, userId, videoId, frameNumber);

      const frameRecord = {
        video_id: videoId,
        frame_number: frameNumber,
        frame_path: storagePath,
        lighting: analysis.lighting,
        sharpness: analysis.sharpness,
        framing: analysis.framing,
        overall: analysis.overall,
        issues: analysis.issues,
        timestamp: (frameNumber - 1) / fps
      };

      await supabaseAdmin.from('video_frames').insert(frameRecord);

      frameAnalysisResults.push(analysis);

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    let audioAnalysis = null;
    if (metadata.hasAudio) {
      try {
        await extractAudio(videoPath, audioPath);
        audioAnalysis = await analyzeAudioWithWhisper(audioPath);
      } catch (error) {
        console.error('Audio processing error:', error);
        audioAnalysis = {
          overall: null,
          issues: ['Audio extraction or analysis failed']
        };
      }
    }

    const avgLighting = frameAnalysisResults.reduce((sum, f) => sum + f.lighting, 0) / frameAnalysisResults.length;
    const avgSharpness = frameAnalysisResults.reduce((sum, f) => sum + f.sharpness, 0) / frameAnalysisResults.length;
    const avgFraming = frameAnalysisResults.reduce((sum, f) => sum + f.framing, 0) / frameAnalysisResults.length;

    const videoQuality = (avgLighting + avgSharpness + avgFraming) / 3;

    let finalScore;
    if (audioAnalysis && audioAnalysis.overall !== null) {
      finalScore = (videoQuality * 0.6) + (audioAnalysis.overall * 0.4);
    } else {
      finalScore = videoQuality;
    }

    const allIssues = {
      lighting: [],
      framing: [],
      technical: [],
      audio: audioAnalysis?.issues || []
    };

    frameAnalysisResults.forEach(frame => {
      frame.issues.forEach(issue => {
        const issueLower = issue.toLowerCase();
        if (issueLower.includes('light') || issueLower.includes('bright') || issueLower.includes('dark')) {
          if (!allIssues.lighting.includes(issue)) allIssues.lighting.push(issue);
        } else if (issueLower.includes('fram') || issueLower.includes('compos') || issueLower.includes('crop')) {
          if (!allIssues.framing.includes(issue)) allIssues.framing.push(issue);
        } else {
          if (!allIssues.technical.includes(issue)) allIssues.technical.push(issue);
        }
      });
    });

    await supabaseAdmin
      .from('video_analysis')
      .update({
        lighting_score: Math.round(avgLighting * 10) / 10,
        sharpness_score: Math.round(avgSharpness * 10) / 10,
        framing_score: Math.round(avgFraming * 10) / 10,
        audio_score: audioAnalysis?.overall ? Math.round(audioAnalysis.overall * 10) / 10 : null,
        final_score: Math.round(finalScore * 10) / 10,
        issues: allIssues,
        processing_completed_at: new Date().toISOString()
      })
      .eq('video_id', videoId);

    await supabaseAdmin
      .from('videos')
      .update({
        status: 'completed',
        processing_completed_at: new Date().toISOString()
      })
      .eq('id', videoId);

    clearTimeout(timeoutId);
    await cleanupTempFiles(workDir);

    console.log(`Video ${videoId} processed successfully`);

  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`Video ${videoId} processing failed:`, error);

    await supabaseAdmin
      .from('videos')
      .update({
        status: 'failed',
        error_message: error.message || 'Unknown error occurred',
        processing_completed_at: new Date().toISOString()
      })
      .eq('id', videoId);

    await cleanupTempFiles(workDir);
  }
}
