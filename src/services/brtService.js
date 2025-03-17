// src/services/brtService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_BASE_URL;

// Create an Axios instance with base URL and headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all BRTs
export const fetchBrts = async () => {
  const response = await api.get('/brts');
  return response.data;
};

// Create a new BRT
export const createBrt = async (brtData) => {
  const response = await api.post('/brts', brtData);
  return response.data;
};

// Update a BRT
export const updateBrt = async (id, brtData) => {
  const response = await api.put(`/brts/${id}`, brtData);
  return response.data;
};

// Delete a BRT
export const deleteBrt = async (id) => {
  const response = await api.delete(`/brts/${id}`);
  return response.data;
};