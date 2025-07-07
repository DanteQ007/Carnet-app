// services/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Crear una instancia de axios con el token si existe
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token en cada solicitud automáticamente
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Función para iniciar sesión
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response;
};

// Obtener perfil del usuario autenticado
export const getPerfil = async () => {
  const response = await axiosInstance.get('/perfil');
  return response.data;
};

// Obtener todos los trabajadores
export const getTrabajadores = async () => {
  const response = await axiosInstance.get('/trabajadores');
  return response.data;
};
