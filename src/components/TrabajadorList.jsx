import React, { useEffect, useState, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getTrabajadores } from '../services/api';
import './TrabajadorList.css';

const TrabajadorList = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const barcodeRefs = useRef({});
  const cardRefs = useRef({});

  // Obtener trabajadores al cargar
  useEffect(() => {
    getTrabajadores()
      .then(data => setTrabajadores(data))
      .catch(error => console.error("Error cargando trabajadores:", error));
  }, []);

  // Generar códigos de barras
  useEffect(() => {
    trabajadores.forEach(t => {
      if (barcodeRefs.current[t.id]) {
        JsBarcode(barcodeRefs.current[t.id], t.documento?.toString(), {
          format: 'CODE128',
          displayValue: false,
          height: 40,
          width: 1.5,
          margin: 0,
        });
      }
    });
  }, [trabajadores]);

  // Convertir imágenes <img> externas a base64 para incluir en PDF
  const convertImagesToBase64 = async (element) => {
    const images = element.querySelectorAll('img');

    for (let img of images) {
      const dataUrl = await fetch(img.src)
        .then(res => res.blob())
        .then(blob => new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        }))
        .catch(() => null);

      if (dataUrl) {
        img.setAttribute('src', dataUrl);
      }
    }
  };

  // Descargar carnet como PDF
  const handleDownloadPDF = async (id, nombre) => {
    const card = cardRefs.current[id];
    if (!card) return;

    await convertImagesToBase64(card); // ✅ convertir imágenes externas a base64

    const canvas = await html2canvas(card);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [250, 400],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 250, 400);
    pdf.save(`Carnet_${nombre}.pdf`);
  };

  return (
    <div className="card-container">
      {trabajadores.map(t => (
        <div
          className="card"
          key={t.id}
          ref={el => (cardRefs.current[t.id] = el)}
        >
          <div className="card-body">
            <div className="header">
              <img src="/logo.png" alt="Logo SENA" className="logo" />
            </div>
            <div className="photo-section ">
              <img
                src={t.foto ? `http://192.168.1.6:8000/images/${t.foto.split('/').pop()}` : "/placeholder.jpg"}

                alt={t.nombre}
                className="profile-photo"
              />
            </div>
            <div className="info">
              <p className="label">{t.tipo?.toUpperCase() || 'INSTRUCTOR'}</p>
              <hr />
              <p className="name">{t.nombre?.toUpperCase()}</p>
              <p className="id">CC {t.documento} &nbsp;&nbsp;&nbsp; RH: A+</p>

              <div className="barcode-container">
                <svg
                  ref={el => (barcodeRefs.current[t.id] = el)}
                  className="barcode"
                />
              </div>

              <p className="region">Regional Santander</p>
              <p className="center">
                Centro Industrial del Diseño<br />y la Manufactura
              </p>

              <div className="acciones" style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => handleDownloadPDF(t.id, t.nombre)}>Descargar PDF</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrabajadorList;
