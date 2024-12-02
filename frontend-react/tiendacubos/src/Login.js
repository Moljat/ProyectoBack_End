import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = { correo: email, contrasena: password };

    try {
      const response = await fetch("http://localhost:8001/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken); // Almacenar el token de acceso
        localStorage.setItem("refreshToken", data.refreshToken); // Almacenar el token de refresco
        setIsAuthenticated(true); // Establecer que el usuario está autenticado
        alert("Inicio de sesión exitoso");
        navigate("/"); // Redirigir a la página principal
      } else {
        alert(data.error || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Error al realizar el login");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <button
        className="admin-btn"
        onClick={() => navigate("/admin-usuarios")}
      >
        Administración de Usuarios
      </button>
    </div>
  );
};

export default Login;
