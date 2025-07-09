import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CarnetDetalle from './CarnetDetalle';

const PerfilUsuario = () => {
  const [persona, setPersona] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/perfil', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPersona(response.data);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };

    fetchPerfil();
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      {persona ? <CarnetDetalle persona={persona} /> : <p>Cargando perfil...</p>}
    </div>
  );
};

export default PerfilUsuario;
