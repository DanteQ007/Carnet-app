import React, { useEffect, useState, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getTrabajadores } from '../services/api';
import './TrabajadorList.css';

const TrabajadorList = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const barcodeRefs = useRef({});
  const cardRefs = useRef({});

  useEffect(() => {
    getTrabajadores()
      .then(data => setTrabajadores(data))
      .catch(error => console.error("Error cargando trabajadores:", error));
  }, []);

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

  const handleDownloadPDF = async () => {
    if (!selectedId) return;
    const selected = trabajadores.find(t => t.id === selectedId);
    const card = cardRefs.current[selectedId];
    if (!card) return;

    await convertImagesToBase64(card);

    const canvas = await html2canvas(card);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [250, 400],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 250, 400);
    pdf.save(`Carnet_${selected.nombre}.pdf`);
  };

  const selectedTrabajador = trabajadores.find(t => t.id === selectedId);

  useEffect(() => {
    if (selectedId) {
      const t = trabajadores.find(trab => trab.id === selectedId);
      if (t && barcodeRefs.current[t.id]) {
        JsBarcode(barcodeRefs.current[t.id], t.documento?.toString(), {
          format: 'CODE128',
          displayValue: false,
          height: 40,
          width: 1.5,
          margin: 0,
        });
      }
    }
  }, [selectedId, trabajadores]);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Carnets Digitales de Trabajadores</h1>
        <p>Haz clic sobre un carnet para verlo en detalle y descargarlo como PDF.</p>
      </header>

      <div className="card-container">
        {trabajadores.map(t => (
          <div
            key={t.id}
            className={`card ${selectedId === t.id ? 'selected' : ''}`}
            onClick={() => setSelectedId(t.id)}
            ref={el => (cardRefs.current[t.id] = el)}
            style={{ cursor: 'pointer', transform: selectedId === t.id ? 'scale(1.02)' : 'scale(1)', border: selectedId === t.id ? '2px solid #007bff' : '1px solid #ccc' }}
          >
            <div className="card-body">
              <div className="header">
                <img src="/logo.png" alt="Logo SENA" className="logo" />
              </div>
              <div className="photo-section">
                <img
                  src={t.foto ? `http://192.168.1.6:8000/images/${t.foto.split('/').pop()}` : "/predeterminado.png"}
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
                  <svg ref={el => (barcodeRefs.current[t.id] = el)} className="barcode" />
                </div>
                <p className="region">Regional Santander</p>
                <p className="center">
                  Centro Industrial del Diseño<br />y la Manufactura
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTrabajador && (
        <div className="detalle-container">
          <h3>Carnet Seleccionado</h3>
          <div
            className="card"
            ref={el => (cardRefs.current[selectedTrabajador.id] = el)}
          >
            <div className="card-body">
              <div className="header">
                <img src="/logo.png" alt="Logo SENA" className="logo" />
              </div>
              <div className="photo-section">
                <img
                  src={selectedTrabajador.foto ? `http://192.168.1.6:8000/images/${selectedTrabajador.foto.split('/').pop()}` : "/placeholder.jpg"}
                  alt={selectedTrabajador.nombre}
                  className="profile-photo"
                />
              </div>
              <div className="info">
                <p className="label">{selectedTrabajador.tipo?.toUpperCase() || 'INSTRUCTOR'}</p>
                <hr />
                <p className="name">{selectedTrabajador.nombre?.toUpperCase()}</p>
                <p className="id">CC {selectedTrabajador.documento} &nbsp;&nbsp;&nbsp; RH: A+</p>
                <div className="barcode-container">
                  <svg ref={el => (barcodeRefs.current[selectedTrabajador.id] = el)} className="barcode" />
                </div>
                <p className="region">Regional Santander</p>
                <p className="center">
                  Centro Industrial del Diseño<br />y la Manufactura
                </p>
              </div>
            </div>
          </div>
          <button className="download-button" onClick={handleDownloadPDF}>
            Descargar PDF
          </button>
        </div>
      )}

      <footer className="page-footer">
        <p>&copy; {new Date().getFullYear()} Sistema de Carnetización - SENA</p>
      </footer>
    </div>
  );
};

export default TrabajadorList;
