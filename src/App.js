import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import CarnetDetalle from './components/CarnetDetalle';
import CarnetList from './components/CarnetList';

function App() {
  const [perfil, setPerfil] = useState(null);

  if (!perfil) return (
    <LoginForm onLoginSuccess={(data) => {
      console.log('Perfil recibido:', data);
      setPerfil(data);
    }} />
  );

  if (perfil.role === 'admin') {
    return <CarnetList />;
  }

  const persona = {
    ...perfil,
    tipo: perfil.tipo || perfil.role || 'usuario',
    regional: perfil.regional || 'Regional Santander',
    centro: perfil.centro || 'Centro Industrial del Diseño',
  };

  console.log('Persona mostrada:', persona);

  return <CarnetDetalle persona={persona} />;
}


export default App;
