import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NaturalezaPage from './NaturalezaPage';
import AgregarModificar from './AgregarModificar';
import VerProducto from './VerProducto';
import { ProductoProvider } from './ProductoContext';

function App() {
  return (
    <ProductoProvider>
    <Router>
      <Routes>
        {/* Ruta principal que muestra NaturalezaPage */}
        <Route path="/" element={<NaturalezaPage />} />

        {/* Ruta secundaria que muestra AgregarModificar */}
        <Route path="/agregar-modificar" element={<AgregarModificar />} />


        <Route path="/VerProducto" element={<VerProducto />} />
        
      </Routes>
    </Router>
    </ProductoProvider>
  );
}

export default App;
