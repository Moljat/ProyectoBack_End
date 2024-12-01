import React, { useState } from "react";
import './AdminUsuario.css';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([
    { id: 1, email: "admin@example.com", role: "Admin" },
    { id: 2, email: "user@example.com", role: "User" },
  ]);

  const agregarUsuario = () => {
    const email = prompt("Introduce el correo del nuevo usuario:");
    const role = prompt("Introduce el rol del usuario (Admin/User):");
    if (email && role) {
      setUsuarios([...usuarios, { id: usuarios.length + 1, email, role }]);
      alert("Usuario agregado.");
    }
  };

  const eliminarUsuario = (id) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar este usuario?");
    if (confirm) {
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
      alert("Usuario eliminado.");
    }
  };

  return (
    <div>
      <h2>Administración de Usuarios</h2>
      <button onClick={agregarUsuario}>Agregar Usuario</button>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.email} - {usuario.role}{" "}
            <button onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsuarios;
