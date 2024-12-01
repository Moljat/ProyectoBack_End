import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NaturalezaPage from './NaturalezaPage';
import AgregarModificar from './AgregarModificar';
import VerProducto from './VerProducto';
import { ProductoProvider } from './ProductoContext';
import CarritoCompras from './carritoCompras';
import Login from './Login';

function App() {
  // Estado para saber si estamos autenticados
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Estado para controlar el "loading" (carga inicial)
 // const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay datos de sesión en el localStorage
  const checkAuth = () => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true); // Si el usuario existe en localStorage, está autenticado
    } else {
      setIsAuthenticated(false); // Si no, no está autenticado
    }
   
  };

  // Ejecutamos checkAuth cuando el componente se monta
  useEffect(() => {
    checkAuth();
  }, []);

  // Si la app está cargando, no renderizamos nada más
  /*if (isLoading) {
    return <div>Cargando...</div>; // Puedes personalizar esto
  }*/	

  return (
    <ProductoProvider>
      <Router>
        <Routes>
          {/* Página de inicio de sesión */}
          
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

          {/* Ruta principal protegida */}
          <Route
            path="/"
            element={ isAuthenticated ? <NaturalezaPage />: <Navigate to="/login" />} // Redirige si no está autenticado
          />
          {/* Rutas protegidas */}
          <Route
            path="/agregar-modificar"
            element={
              isAuthenticated ? 
                <AgregarModificar />
              : 
                <Navigate to="/login" />
              
            }
          />
          <Route
            path="/VerProducto"
            element={
              isAuthenticated ? 
                <VerProducto />
               : 
                <Navigate to="/login" />
              
            }
          />
          <Route
            path="/CarritoCompras"
            element={
              isAuthenticated ? 
                <CarritoCompras />
               : 
                <Navigate to="/login" />
              
            }
          />
        </Routes>
      </Router>
    </ProductoProvider>
  );
}

export default App;
