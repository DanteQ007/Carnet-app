// src/services/api.js
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/trabajadores";

export const getTrabajadores = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error cargando trabajadores:", error);
    throw error;
  }
};
