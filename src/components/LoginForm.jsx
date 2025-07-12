import React, { useState } from 'react';
import { login, getPerfil } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginForm.css'; // archivo CSS personalizado

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      const perfil = await getPerfil();
      onLoginSuccess(perfil);
    } catch (error) {
      alert('Correo o contraseña incorrectos');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center mb-4 text-success">Acceso al Sistema</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="email">Correo institucional (SENA-trabajador) o (personal-aprendiz)</label>
            <input
              type="email"
              id="email"
              list="emailSuggestions"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@misena.edu.co"
              required
            />
            <datalist id="emailSuggestions">
              <option value="aprendiz@misena.edu.co" />
              <option value="funcionario@misena.edu.co" />
              <option value="contratista@misena.edu.co" />
              <option value="admin@correo.com" />
              <option value="aprendiz@gmail.com" />
            </datalist>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
