import { getSupabaseToken } from './supabaseAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async getHeaders() {
    const token = await getSupabaseToken();
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.getHeaders();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized request - token may be expired');
        }
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, {
      method: 'GET'
    });
  }

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  async uploadVideo(file) {
    const uploadUrlResponse = await this.post('/api/upload-url', {
      filename: file.name,
      filesize: file.size,
      mimetype: file.type
    });

    const token = await getSupabaseToken();

    const uploadResponse = await fetch(uploadUrlResponse.upload_url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload video to storage');
    }

    return uploadUrlResponse.video_id;
  }

  async processVideo(videoId) {
    return this.post('/api/process', {
      video_id: videoId
    });
  }

  async getResults(videoId, includeFrames = false) {
    const endpoint = `/api/results/${videoId}${includeFrames ? '?include_frames=true' : ''}`;
    return this.get(endpoint);
  }

  async getVideoHistory(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/api/videos${queryParams ? `?${queryParams}` : ''}`;
    return this.get(endpoint);
  }

  async deleteVideo(videoId) {
    return this.delete(`/api/videos/${videoId}`);
  }

  async healthCheck() {
    return this.get('/api/health');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
