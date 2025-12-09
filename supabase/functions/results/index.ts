import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('Authorization')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const videoId = pathParts[pathParts.length - 1];
    const includeFrames = url.searchParams.get('include_frames') === 'true';

    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Video ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      return new Response(
        JSON.stringify({ error: 'Video not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (video.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (video.status === 'pending_upload') {
      return new Response(
        JSON.stringify({ error: 'Video has not been uploaded yet' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (video.status === 'processing') {
      const { data: analysis } = await supabase
        .from('video_analysis')
        .select('frame_count')
        .eq('video_id', videoId)
        .maybeSingle();

      const { count: processedFrames } = await supabase
        .from('video_frames')
        .select('*', { count: 'exact', head: true })
        .eq('video_id', videoId);

      const totalFrames = analysis?.frame_count || 0;
      const progress = totalFrames > 0 ? Math.round((processedFrames! / totalFrames) * 100) : 0;

      return new Response(
        JSON.stringify({
          video_id: videoId,
          status: 'processing',
          progress: progress,
          message: 'Video is still being processed'
        }),
        {
          status: 202,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (video.status === 'failed') {
      return new Response(
        JSON.stringify({
          video_id: videoId,
          status: 'failed',
          error_message: video.error_message || 'Processing failed'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: analysis, error: analysisError } = await supabase
      .from('video_analysis')
      .select('*')
      .eq('video_id', videoId)
      .maybeSingle();

    if (analysisError) {
      console.error('Analysis fetch error:', analysisError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch analysis data' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!analysis) {
      return new Response(
        JSON.stringify({ error: 'Analysis data not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const processingTime = video.processing_completed_at && video.processing_started_at
      ? Math.round((new Date(video.processing_completed_at).getTime() - new Date(video.processing_started_at).getTime()) / 1000)
      : null;

    const response: any = {
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

    if (includeFrames) {
      const { data: frames, error: framesError } = await supabase
        .from('video_frames')
        .select('*')
        .eq('video_id', videoId)
        .order('frame_number', { ascending: true });

      if (!framesError && frames) {
        response.frames = frames;
      }
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});