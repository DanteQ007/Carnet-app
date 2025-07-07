import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import TrabajadorDetalle from './components/TrabajadorDetalle';
import CarnetList from './components/CarnetList';

function App() {
  const [perfil, setPerfil] = useState(null);

  if (!perfil) return <LoginForm onLoginSuccess={setPerfil} />;

  // Admin ve todos los carnets
  if (perfil.role === 'admin') {
    return <CarnetList />;
  }

  // Usuario normal ve su propio carnet
  return <TrabajadorDetalle trabajador={perfil.trabajador} />;
}

export default App;
