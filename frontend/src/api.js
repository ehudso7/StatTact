import axios from 'axios';

// Set the base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const fetchTeams = async () => {
  try {
    const response = await apiClient.get('/fetch-teams');
    return response.data.teams;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const generateFormation = async (team, opponent) => {
  try {
    const response = await apiClient.get('/generate-formation', {
      params: { team, opponent }
    });
    return response.data.result;
  } catch (error) {
    console.error('Error generating formation:', error);
    throw error;
  }
};

export default {
  fetchTeams,
  generateFormation,
};
