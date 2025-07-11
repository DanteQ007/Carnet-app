import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './CarnetDetalle.css';


const CarnetDetalle = ({ persona }) => {
  const barcodeRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (persona?.documento && barcodeRef.current) {
      JsBarcode(barcodeRef.current, persona.documento.toString(), {
        format: 'CODE128',
        displayValue: false,
        height: 40,
        width: 1.5,
        margin: 0,
      });
    }
  }, [persona]);

const handleDownloadPDF = async () => {
  if (!cardRef.current) return;

  // ✅ Asegura que todas las imágenes dentro del carnet estén cargadas
  const images = cardRef.current.querySelectorAll('img');
  const promises = Array.from(images).map((img) => {
    return new Promise((resolve) => {
      if (img.complete) resolve();
      else {
        img.onload = resolve;
        img.onerror = resolve;
      }
    });
  });

  await Promise.all(promises);

  // 🖼️ Captura el carnet en un canvas
  const canvas = await html2canvas(cardRef.current, {
    scale: 3,
    useCORS: true,
    allowTaint: true, // por si las imágenes están en dominio local
  });

  // 🧾 Convierte el canvas a imagen
  const imgData = canvas.toDataURL('image/png');

  // 📄 Crea el PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [250, 400], // tamaño personalizado tipo carnet
  });

  // 📥 Agrega la imagen y descarga
  pdf.addImage(imgData, 'PNG', 0, 0, 250, 400);
  pdf.save(`Carnet_${persona.nombre}.pdf`);
};



  if (!persona) return null;

  return (
    <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 40 }}>
      <div>
        <h2 style={{ textAlign: 'center' }}>Mi Carnet</h2>
        <div className="card" ref={cardRef}>
          <div className="header">
            <img src="/logo.png" alt="Logo" className="logo" />
          </div>
          <div className="photo-section">
        <img
  src={`http://127.0.0.1:8000/imagen/${persona.foto}`}
  alt={persona.nombre}
  crossOrigin="anonymous"
  className="profile-photo"
/>

            
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div className="info">
              <p className="label">{(persona.tipo || 'CARNET').toUpperCase()}</p>
              <hr />
              <p className="name">{persona.nombre?.toUpperCase()}</p>
              <p className="id">
                CC: {persona.documento} — RH: {persona.tipo_sangre || 'N/D'}
              </p>
              <svg ref={barcodeRef} className="barcode" />
              <p className="region">{persona.regional || 'Regional Santander'}</p>
              <p className="center">
                {persona.centro || 'Centro Industrial del Diseño'}<br />y la Manufactura
              </p>

              {persona.tipo === 'aprendiz' && (
                <div className="ficha-info" style={{ fontSize: '12px', marginTop: 5 }}>
                  <p style={{ margin: 0 }}>
                    Ficha: {persona.numero_ficha} — {persona.nivel_formacion || 'Formación N/D'} - {persona.nombre_ficha}
                  </p>
                  <p style={{ margin: 0 }}>
                    Ingreso: {persona.fecha_ingreso || 'N/D'} <br />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button onClick={handleDownloadPDF} className="download-button">
          Descargar PDF
        </button>
       <form
  onSubmit={async (e) => {
    e.preventDefault();
    const archivo = e.target.foto.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('foto', archivo);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/foto`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Foto subida correctamente.');
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'al subir la foto.'}`);
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Fallo de red al subir la imagen.');
    }
  }}
>
  <input type="file" name="foto" accept="image/*" required />
  <button type="submit">Subir Foto</button>
</form>


      </div>

      <div className="info-extra">
        <h2>Información del {persona.tipo === 'aprendiz' ? 'Aprendiz' : persona.tipo === 'admin' ? 'Administrador' : 'Usuario'}</h2>
        <p><strong>Nombre:</strong> {persona.nombre}</p>
        <p><strong>Documento:</strong> {persona.documento}</p>
        <p><strong>Correo Sena:</strong> {persona.correo_sena}</p>
        <p><strong>Correo Personal:</strong> {persona.correo_personal}</p>
        <p><strong>Celular:</strong> {persona.celular}</p>
        <p><strong>Fecha de Nacimiento:</strong> {persona.fecha_nacimiento}</p>
        <p><strong>Estado:</strong> {persona.estado}</p>
        <p><strong>Tipo de Sangre:</strong> {persona.tipo_sangre}</p>

        {persona.tipo === 'aprendiz' && (
          <>
            <p><strong>Número de Ficha:</strong> {persona.numero_ficha}</p>
            <p><strong>Nombre de Ficha:</strong> {persona.nombre_ficha}</p>
            <p><strong>Nivel de Formación:</strong> {persona.nivel_formacion}</p>
            <p><strong>Fecha de Ingreso:</strong> {persona.fecha_ingreso}</p>
          </>
        )}

        {persona.tipo === 'funcionario' && persona.funcionario && (
          <>
            <p><strong>Grado:</strong> {persona.funcionario.grado_id}</p>
            <p><strong>Área Temática:</strong> {persona.funcionario.area_tematico_id}</p>
            <p><strong>Fecha Ingreso:</strong> {persona.funcionario.fecha_ingreso}</p>
          </>
        )}

        {persona.tipo === 'contratista' && persona.contratista && (
          <>
            <p><strong>Área:</strong> {persona.contratista.area}</p>
            <p><strong>Fecha Inicio:</strong> {persona.contratista.fecha_inicio}</p>
            <p><strong>Fecha Fin:</strong> {persona.contratista.fecha_fin}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CarnetDetalle;
