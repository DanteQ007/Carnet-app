import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './TrabajadorList.css';

const TrabajadorDetalle = ({ trabajador }) => {
  const barcodeRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (trabajador && barcodeRef.current) {
      JsBarcode(barcodeRef.current, trabajador.documento.toString(), {
        format: 'CODE128',
        displayValue: false,
        height: 40,
        width: 1.5,
        margin: 0,
      });
    }
  }, [trabajador]);

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [250, 400],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 250, 400);
    pdf.save(`Carnet_${trabajador.nombre}.pdf`);
  };

  return (
    <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 40 }}>
      {/* Carnet */}
      <div>
        <h2 style={{ textAlign: 'center' }}>Mi Carnet</h2>
        <div
          className="card"
          ref={cardRef}
        >
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
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div className="info">
              <p className="label">{trabajador.tipo?.toUpperCase() || 'INSTRUCTOR'}</p>
              <hr />
              <p className="name">{trabajador.nombre?.toUpperCase()}</p>
             <p className="id">
  CC: {trabajador.documento} — RH: {trabajador.tipo_sangre || 'N/D'}
</p>

              <svg ref={barcodeRef} className="barcode" />
              <p className="region">{trabajador.regional || 'Regional Santander'}</p>
              <p className="center">
                {trabajador.centro || 'Centro Industrial del Diseño'}<br />
                y la Manufactura
              </p>
            </div>

           
          </div>
        </div>

        <button onClick={handleDownloadPDF} className="download-button">
          Descargar PDF
        </button>
      </div>

      {/* Información adicional */}
      <div className="info-extra">
        <h2>Información del Trabajador</h2>
        <p><strong>Nombre:</strong> {trabajador.nombre}</p>
        <p><strong>Documento:</strong> {trabajador.documento}</p>
        <p><strong>Correo Sena:</strong> {trabajador.correo_sena}</p>
        <p><strong>Correo Personal:</strong> {trabajador.correo_personal}</p>
        <p><strong>Celular:</strong> {trabajador.celular}</p>
        <p><strong>Fecha de Nacimiento:</strong> {trabajador.fecha_nacimiento}</p>
        <p><strong>Estado:</strong> {trabajador.estado}</p>
        <p><strong>Cargo:</strong> {trabajador.cargo}</p>
        <p><strong>Tipo:</strong> {trabajador.tipo}</p>

        {trabajador.tipo === 'funcionario' && trabajador.funcionario && (
          <>
            <p><strong>Grado:</strong> {trabajador.funcionario.grado_id}</p>
            <p><strong>Área Temática:</strong> {trabajador.funcionario.area_tematico_id}</p>
            <p><strong>Fecha Ingreso:</strong> {trabajador.funcionario.fecha_ingreso}</p>
          </>
        )}

        {trabajador.tipo === 'contratista' && trabajador.contratista && (
          <>
            <p><strong>Área:</strong> {trabajador.contratista.area}</p>
            <p><strong>Fecha Inicio:</strong> {trabajador.contratista.fecha_inicio}</p>
            <p><strong>Fecha Fin:</strong> {trabajador.contratista.fecha_fin}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default TrabajadorDetalle;
