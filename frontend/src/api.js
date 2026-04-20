// import axios from 'axios';

// const BASE = 'http://127.0.0.1:8000';

// const api = axios.create({ baseURL: BASE });

// // Auto-attach token to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export const register = (data) => api.post('/auth/register', data);
// export const login    = (data) => api.post('/auth/login', data);

// export const predictDiabetes = (data) => api.post('/predict/diabetes', data);
// export const predictCancer   = (data) => api.post('/predict/cancer', data);
// export const predictHeart    = (data) => api.post('/predict/heart', data);

// export const getHistory = () => api.get('/history/');
// export const getStats   = () => api.get('/history/stats');

// export default api;

// // simulate function 
// export const simulate = (disease, data) => api.post(`/predict/simulate/${disease}`, data);

// // email function
// export const emailReport = (predictionId) =>
//   api.post(`/predict/email-report/${predictionId}`);



import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (data) => api.post('/auth/register', data);
export const login    = (data) => api.post('/auth/login', data);

export const predictDiabetes = (data) => api.post('/predict/diabetes', data);
export const predictCancer   = (data) => api.post('/predict/cancer', data);
export const predictHeart    = (data) => api.post('/predict/heart', data);

export const simulate    = (disease, data) => api.post(`/predict/simulate/${disease}`, data);
export const emailReport = (id)            => api.post(`/predict/email-report/${id}`);

export const getHistory = () => api.get('/history/');
export const getStats   = () => api.get('/history/stats');

export default api;