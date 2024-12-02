import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NaturalezaPage from "./NaturalezaPage";
import AgregarModificar from "./AgregarModificar";
import VerProducto from "./VerProducto";
import { ProductoProvider } from "./ProductoContext";
import CarritoCompras from "./carritoCompras";
import Login from "./Login";
import AdminUsuarios from "./AdminUsuarios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para verificar si el usuario está autenticado
  const checkAuth = () => {
    const token = localStorage.getItem("accessToken"); // Obtenemos el token de acceso
    if (token) {
      setIsAuthenticated(true); // Si hay token, el usuario está autenticado
    } else {
      setIsAuthenticated(false); // Si no hay token, no está autenticado
    }
  };

  useEffect(() => {
    checkAuth(); // Verificamos la autenticación cuando la app se cargue
  }, []);

  return (
    <ProductoProvider>
      <Router>
        <Routes>
          {/* Página de inicio de sesión */}
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />

          {/* Página de administración de usuarios (Ruta protegida) */}
          <Route
            path="/admin-usuarios"
            element={
              isAuthenticated ? <AdminUsuarios /> : <Navigate to="/login" />
            }
          />

          {/* Ruta principal protegida */}
          <Route
            path="/"
            element={isAuthenticated ? <NaturalezaPage /> : <Navigate to="/login" />}
          />

          {/* Rutas protegidas */}
          <Route
            path="/agregar-modificar"
            element={isAuthenticated ? <AgregarModificar /> : <Navigate to="/login" />}
          />
          <Route
            path="/VerProducto"
            element={isAuthenticated ? <VerProducto /> : <Navigate to="/login" />}
          />
          <Route
            path="/CarritoCompras"
            element={isAuthenticated ? <CarritoCompras /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </ProductoProvider>
  );
}

export default App;