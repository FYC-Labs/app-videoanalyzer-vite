import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo',
  'video/x-matroska'
];

const MAX_FILE_SIZE = 100 * 1024 * 1024;

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

    if (req.method === 'POST') {
      const { filename, filesize, mimetype } = await req.json();

      if (!filename || !filesize || !mimetype) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: filename, filesize, mimetype' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (!ALLOWED_VIDEO_TYPES.includes(mimetype)) {
        return new Response(
          JSON.stringify({ error: 'Invalid file type. Allowed types: mp4, mov, webm, avi, mkv' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (filesize > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({ error: 'File size exceeds maximum limit of 100MB' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const videoId = crypto.randomUUID();
      const fileExtension = filename.split('.').pop();
      const filePath = `${user.id}/${videoId}/video.${fileExtension}`;

      const { data: videoRecord, error: dbError } = await supabase
        .from('videos')
        .insert({
          id: videoId,
          user_id: user.id,
          original_filename: filename,
          file_path: filePath,
          storage_bucket: 'ugc-videos',
          status: 'pending_upload'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        return new Response(
          JSON.stringify({ error: 'Failed to create video record' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const { data: signedUrlData, error: urlError } = await supabase
        .storage
        .from('ugc-videos')
        .createSignedUploadUrl(filePath);

      if (urlError) {
        console.error('Storage error:', urlError);
        await supabase.from('videos').delete().eq('id', videoId);
        return new Response(
          JSON.stringify({ error: 'Failed to generate upload URL' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({
          video_id: videoId,
          upload_url: signedUrlData.signedUrl,
          file_path: filePath,
          bucket: 'ugc-videos',
          token: signedUrlData.token,
          expires_at: new Date(Date.now() + 3600000).toISOString()
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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