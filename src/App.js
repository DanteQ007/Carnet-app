import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import TrabajadorDetalle from './components/TrabajadorDetalle';
import CarnetList from './components/CarnetList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [perfil, setPerfil] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              !perfil ? (
                <LoginForm onLoginSuccess={setPerfil} />
              ) : (
                <TrabajadorDetalle trabajador={perfil.trabajador} />
              )
            }
          />
          <Route path="/admin/carnets" element={<CarnetList />} />
          {/* Agrega más rutas aquí si lo necesitas */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
