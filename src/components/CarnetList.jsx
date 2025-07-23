import React, { useEffect, useState } from 'react';
import CarnetDetalle from './CarnetDetalle';
import { getTrabajadores, getAprendices } from '../services/api';
import './CarnetList.css';

const CarnetList = () => {
  const [personas, setPersonas] = useState([]);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchDatos = async () => {
  try {
    const [trabajadoresData, aprendicesData] = await Promise.all([
      getTrabajadores(),
      getAprendices(),
    ]);

    const trabajadoresFormateados = trabajadoresData.map((t) => ({
      ...t,
      tipo: t.funcionario ? 'funcionario' : t.contratista ? 'contratista' : 'usuario',
      regional: 'Regional Santander',
      centro: 'Centro Industrial del Diseño',
    }));

    const aprendicesFormateados = aprendicesData.map((a) => ({
      ...a,
      tipo: 'aprendiz',
      regional: 'Regional Santander',
      centro: 'Centro Industrial del Diseño',
    }));

    setPersonas([...trabajadoresFormateados, ...aprendicesFormateados]);
  } catch (error) {
    console.error('Error cargando personas:', error);
  }
};

    fetchDatos();
  }, []);

  const personasFiltradas = personas.filter((p) =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.documento?.toString().includes(busqueda)
  );

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Gestión de Carnets</h1>
        <p>Haz clic en un carnet para ver los detalles</p>

        <div className="busqueda-container">
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="busqueda-input"
          />
        </div>
      </div>

      <div className="admin-content">
        <div className="card-list">
          {personasFiltradas.map((persona) => (
            <div
              key={`${persona.tipo}-${persona.id}`}
              onClick={() => setPersonaSeleccionada(persona)}
              className={`card-wrapper ${personaSeleccionada?.id === persona.id ? 'active' : ''}`}
            >
              <div className="card">
                <div className="header">
                  <img src="/logo.png" alt="Logo" className="logo" />
                </div>
                <div className="photo-section">
                 <img
  src={
    persona.foto
      ? `http://127.0.0.1:8000/storage/fotos/${persona.foto}`
      : '/predeterminado.png' // esta ruta debe estar en tu public/
  }
  alt={persona.nombre}
  className="profile-photo"
/>
                </div>
                <div className="info">
                  <p className="label">{persona.tipo?.toUpperCase() || 'CARNET'}</p>
                  <hr />
                  <p className="name">{persona.nombre?.toUpperCase()}</p>
                  <p className="id">CC: {persona.documento} — RH: {persona.tipo_sangre || 'N/D'}</p>
                  <p className="region">{persona.regional || 'Regional Santander'}</p>
                  <p className="center">
                    {persona.centro || 'Centro Industrial del Diseño'}<br />
                    y la Manufactura
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {personaSeleccionada && (
          <div className="detail-panel animate-slide-in">
            <CarnetDetalle persona={personaSeleccionada} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CarnetList;