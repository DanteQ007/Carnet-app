import React, { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import CarnetDetalle from './components/CarnetDetalle';
import CarnetList from './components/CarnetList';
import { getPerfil } from './services/api';

function App() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, intenta obtener el perfil si hay token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getPerfil()
        .then((data) => {
          setPerfil(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Token inválido o sesión expirada', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setPerfil(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (data) => {
    setPerfil(data);
  };

  if (loading) return <p className="text-center mt-5">Cargando...</p>;

  if (!perfil) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  if (perfil.role === 'admin') {
    return <CarnetList />;
  }

  const persona = {
    ...perfil,
    tipo: perfil.tipo || perfil.role || 'usuario',
    regional: perfil.regional || 'Regional Santander',
    centro: perfil.centro || 'Centro Industrial del Diseño',
  };

  return <CarnetDetalle persona={persona} />;
}

export default App;
