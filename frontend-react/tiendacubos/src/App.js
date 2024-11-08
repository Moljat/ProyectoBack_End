import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NaturalezaPage from './NaturalezaPage';
import AgregarModificar from './AgregarModificar';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal que muestra NaturalezaPage */}
        <Route path="/" element={<NaturalezaPage />} />

        {/* Ruta secundaria que muestra AgregarModificar */}
        <Route path="/agregar-modificar" element={<AgregarModificar />} />
      </Routes>
    </Router>
  );
}

export default App;
