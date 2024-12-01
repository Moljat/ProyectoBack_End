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

  const checkAuth = () => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
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

          {/* Página de administración de usuarios */}
          <Route
            path="/admin-usuarios"
            element={
              isAuthenticated ? <AdminUsuarios /> : <Navigate to="/login" />
            }
          />

          {/* Ruta principal protegida */}
          <Route
            path="/"
            element={
              isAuthenticated ? <NaturalezaPage /> : <Navigate to="/login" />
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/agregar-modificar"
            element={
              isAuthenticated ? <AgregarModificar /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/VerProducto"
            element={
              isAuthenticated ? <VerProducto /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/CarritoCompras"
            element={
              isAuthenticated ? <CarritoCompras /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </ProductoProvider>
  );
}

export default App;
