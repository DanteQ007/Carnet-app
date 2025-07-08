import React, { useEffect, useState } from 'react';
import TrabajadorDetalle from './TrabajadorDetalle';
import { getTrabajadores, getAprendices } from '../services/api';
import './CarnetList.css'; // Asegúrate de que exista este archivo CSS

const CarnetList = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [trabajadoresData, aprendicesData] = await Promise.all([
          getTrabajadores(),
          getAprendices(),
        ]);

        // Formatear aprendices como si fueran trabajadores
        const aprendicesFormateados = aprendicesData.map((a) => ({
          ...a,
          tipo: 'aprendiz',
          nombre: a.nombre,
          documento: a.documento,
          tipo_sangre: a.tipo_sangre,
          foto: a.foto,
          regional: 'Regional Santander',
          centro: 'Centro Industrial del Diseño',
        }));

        setTrabajadores([...trabajadoresData, ...aprendicesFormateados]);
      } catch (error) {
        console.error('Error cargando trabajadores y aprendices:', error);
      }
    };

    fetchDatos();
  }, []);

  const trabajadoresFiltrados = trabajadores.filter((trabajador) =>
    trabajador.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    trabajador.documento?.toString().includes(busqueda)
  );

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Gestión de Carnets</h1>
        <p>Haz clic en un carnet para ver los detalles del trabajador o aprendiz</p>

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
        {/* Carnets a la izquierda */}
        <div className="card-list">
          {trabajadoresFiltrados.map((trabajador) => (
            <div
              key={`${trabajador.tipo}-${trabajador.id}`}
              onClick={() => setTrabajadorSeleccionado(trabajador)}
              className={`card-wrapper ${trabajadorSeleccionado?.id === trabajador.id ? 'active' : ''}`}
            >
              <div className="card">
                <div className="header">
                  <img src="/logo.png" alt="Logo" className="logo" />
                </div>
                <div className="photo-section">
                  <img
                    src={
                      trabajador.foto
                        ? `http://127.0.0.1:8000/images/${trabajador.foto.split('/').pop()}`
                        : '/predeterminado.png'
                    }
                    alt={trabajador.nombre}
                    className="profile-photo"
                  />
                </div>
                <div className="info">
                  <p className="label">{trabajador.tipo?.toUpperCase() || 'INSTRUCTOR'}</p>
                  <hr />
                  <p className="name">{trabajador.nombre?.toUpperCase()}</p>
                  <p className="id">CC: {trabajador.documento} — RH: {trabajador.tipo_sangre || 'N/D'}</p>
                  <p className="region">{trabajador.regional || 'Regional Santander'}</p>
                  <p className="center">
                    {trabajador.centro || 'Centro Industrial del Diseño'}<br />
                    y la Manufactura
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detalles a la derecha */}
        {trabajadorSeleccionado && (
          <div className="detail-panel animate-slide-in">
            <TrabajadorDetalle trabajador={trabajadorSeleccionado} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CarnetList;
