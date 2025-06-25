// src/services/api.js
import axios from 'axios';

const API_BASE = "http://127.0.0.1:8000/api";
let token = null;

// Configura Axios globalmente
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // ← Importante para Laravel Sanctum
});

// LOGIN
export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  token = response.data.token;

  // Establecer token global para futuras peticiones
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return response.data;
};
export const getTrabajadores = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/trabajadores');
  return response.data;
};
// PERFIL
export const getPerfil = async () => {
  const response = await api.get('/perfil');
  return response.data;
};
