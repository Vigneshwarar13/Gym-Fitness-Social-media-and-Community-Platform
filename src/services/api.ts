import axios, { InternalAxiosRequestConfig } from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req: InternalAxiosRequestConfig) => {
  const storedProfile = localStorage.getItem('profile');
  if (storedProfile && req.headers) {
    const profile = JSON.parse(storedProfile);
    if (profile.token) {
      req.headers.Authorization = `Bearer ${profile.token}`;
    }
  }
  return req;
});

export default API;
