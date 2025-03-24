// src/apiServices.js
import axios from 'axios';

// Base URL for your API
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API Base URL:", BASE_URL);


// Create an axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include credentials (cookies, etc.) with requests
});

// HTTP Methods
export const get = async (endpoint, config = {}) => {
  try {
    const response = await api.get(endpoint, config);
    return response.data;
  } catch (error) {
    console.error(`Error in GET ${endpoint}:`, error);
    throw error;
  }
};

export const post = async (endpoint, data, config = {}) => {
  try {
    const response = await api.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error in POST ${endpoint}:`, error);
    throw error;
  }
};

// You can add more methods as needed (put, delete, etc.)
export const put = async (endpoint, data, config = {}) => {
  try {
    const response = await api.put(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error in PUT ${endpoint}:`, error);
    throw error;
  }
};

export const del = async (endpoint, config = {}) => {
  try {
    const response = await api.delete(endpoint, config);
    return response.data;
  } catch (error) {
    console.error(`Error in DELETE ${endpoint}:`, error);
    throw error;
  }
};

export default {
  get,
  post,
  put,
  del,
};