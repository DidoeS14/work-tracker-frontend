
import axios from 'axios';
import config from '@/config';

// Allows to set a base URL here that will be used for all requests
const api = axios.create({
  baseURL: config.apiBaseUrl, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for adding Authorization token (if needed)
api.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('authToken'); // Example: storing token in localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle Unauthorized error (e.g., redirect to login page)
    }
    return Promise.reject(error);
  }
);

// Functions for making API calls

export const getData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error getting data:', error);
    if (error.response) {
      console.error('Response error:', error.response);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Unexpected error:', error.message);
    }
    throw error; // Re-throw the error for further handling
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const putData = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error putting data:', error);
    throw error;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

export default api;
