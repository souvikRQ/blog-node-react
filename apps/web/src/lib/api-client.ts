/// <reference types="vite/client" />
import axios from 'axios';

const BE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: BE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error formats for frontend toast messages
    const message = error.response?.data?.message || 'Something went wrong';
    const validationErrors = error.response?.data?.errors;
    return Promise.reject({
      message,
      errors: validationErrors,
      status: error.response?.status,
    });
  }
);
