/**
 * Centralized API Client for VirasatRakshak Frontend
 * 
 * Interacts with the backend Express API foundation endpoints:
 * - Health Check
 * - Heritage Sites API
 * - Generative AI Guide & Storyteller API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP Error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.warn(`[API Client Warning] Request to ${url} failed:`, error.message);
    throw error;
  }
}

export const api = {
  health: {
    check: () => request('/health')
  },
  heritage: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams();
      if (params.region) searchParams.append('region', params.region);
      if (params.category) searchParams.append('category', params.category);
      if (params.state) searchParams.append('state', params.state);
      if (params.search) searchParams.append('search', params.search);

      const queryString = searchParams.toString();
      const endpoint = `/heritage${queryString ? `?${queryString}` : ''}`;
      return request(endpoint);
    },
    getById: (idOrSlug) => request(`/heritage/${idOrSlug}`)
  },
  ai: {
    chat: (payload) => request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    story: (payload) => request('/ai/story', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }
};
