import React, { useState, useEffect } from "react";
import './AdminUsuario.css';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Obtener usuarios
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/v1/users');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const agregarUsuario = async () => {
    const email = prompt("Introduce el correo del nuevo usuario:");
    const usuario = prompt("Introduce el nombre del usuario:");
    const contra = prompt("Introduce la contraseña del nuevo usuario:");
    if (email && usuario && contra) {
      const nuevoUsuario = { correo: email, usuario: usuario, contrasena: contra };
      try {
        const response = await fetch('http://localhost:8001/api/v1/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoUsuario),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Usuario agregado.");
          fetchUsuarios();  // Actualizar la lista
        } else {
          alert(data.error || 'Error al agregar el usuario');
        }
      } catch (error) {
        console.error("Error al agregar el usuario:", error);
      }
    }
  };

  const eliminarUsuario = async (id) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar este usuario?");
    if (confirm) {
      try {
        const response = await fetch(`http://localhost:8001/api/v1/users/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (response.ok) {
          alert("Usuario eliminado.");
          fetchUsuarios();  // Actualizar la lista de usuarios
        } else {
          alert(data.error || 'Error al eliminar el usuario');
        }
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  const modificarUsuario = async (id) => {
    if (!usuarioSeleccionado) return;

    const updatedUser = {
      usuario: usuarioSeleccionado.usuario,
      correo: usuarioSeleccionado.correo,
      // Solo actualizamos la contraseña si ha sido modificada
      contrasena: usuarioSeleccionado.contrasena ? usuarioSeleccionado.contrasena : undefined,
    };

    try {
      const response = await fetch(`http://localhost:8001/api/v1/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Usuario modificado.");
        fetchUsuarios();  // Actualizar la lista de usuarios
        setUsuarioSeleccionado(null);  // Cerrar el desglose después de modificar
      } else {
        alert(data.error || 'Error al modificar el usuario');
      }
    } catch (error) {
      console.error("Error al modificar el usuario:", error);
    }
  };

  const handleChange = (e, field) => {
    setUsuarioSeleccionado((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div>
      <h2>Administración de Usuarios</h2>
      <button onClick={agregarUsuario}>Agregar Usuario</button>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id} onClick={() => setUsuarioSeleccionado(usuario)}>
            {usuario.usuario}  {/* Muestra solo el nombre del usuario */}
          </li>
        ))}
      </ul>

      {usuarioSeleccionado && (
        <div className="usuario-detalle">
          <h3>Detalles de {usuarioSeleccionado.usuario}</h3>
          <label>
            <strong>Nombre de usuario</strong>
            <input
              type="text"
              value={usuarioSeleccionado.usuario}
              onChange={(e) => handleChange(e, "usuario")}
            />
          </label>
          <label>
            <strong>Correo</strong>
            <input
              type="email"
              value={usuarioSeleccionado.correo}
              onChange={(e) => handleChange(e, "correo")}
            />
          </label>
          <label>
            <strong>Contraseña</strong>
            <input
              type="password"
              value={usuarioSeleccionado.contrasena || ''}  // Campo de contraseña en blanco por defecto
              onChange={(e) => handleChange(e, "contrasena")}  // Permite cambiar la contraseña si se desea
            />
          </label>

          <button onClick={() => modificarUsuario(usuarioSeleccionado.id)}>
            Modificar Usuario
          </button>
          <button onClick={() => eliminarUsuario(usuarioSeleccionado.id)}>
            Eliminar Usuario
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
