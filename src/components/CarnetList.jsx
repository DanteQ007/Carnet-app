// src/components/CarnetList.jsx
import React, { useEffect, useState } from 'react';
import TrabajadorDetalle from './TrabajadorDetalle';
import { getTrabajadores } from '../services/api'; // tu función para obtener todos los trabajadores

const CarnetList = () => {
  const [trabajadores, setTrabajadores] = useState([]);

  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const data = await getTrabajadores();
        setTrabajadores(data);
      } catch (error) {
        console.error('Error cargando trabajadores:', error);
      }
    };

    fetchTrabajadores();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Todos los Carnets</h1>
        <p>Vista de administrador</p>
      </div>

      <div className="card-container">
        {trabajadores.map((trabajador) => (
          <TrabajadorDetalle key={trabajador.id} trabajador={trabajador} />
        ))}
      </div>
    </div>
  );
};

export default CarnetList;
