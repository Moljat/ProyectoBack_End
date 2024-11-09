import React, { useState } from 'react';

const NaturalezaPage = () => {
  // Estado para el nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: 0.0,
    imagen: '',
  });

  // Función para actualizar el estado del nuevo producto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({
      ...nuevoProducto,
      [name]: value,
    });
  };

  // Función para agregar el producto (llama a la API)
  const addNuevoProducto = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/producto-nuevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id : 0,
          nombre: nuevoProducto.nombre,
          descripcion: nuevoProducto.descripcion,
          precio: parseFloat(nuevoProducto.precio),
           // Imagen por defecto
        }), // Solo enviamos los datos del nuevo producto
      });

      if (!response.ok) {
        throw new Error('Error al agregar el producto');
      }

      const productoAgregado = await response.json();
      console.log('Producto agregado:', productoAgregado);
      // Opcional: actualizar el estado o hacer algo con el nuevo producto agregado
    } catch (error) {
      console.error('Error al hacer la llamada POST:', error);
    }
  };

  return (
    <div className="producto-detalle">
      <header className="header">
        <h1>TIENDA DE CUBOS</h1>
      </header>

      {/* Contenido */}
      <div className="content">
        {/* Imagen del cubo */}
        <div className="cube-image">
          <div className="cube"></div>
        </div>

        {/* Detalles del cubo */}
        <div className="cube-details">
          <label className="detail-item">
            <strong>Nombre del bloque</strong>
            <input
              type="text"
              name="nombre"
              value={nuevoProducto.nombre}
              onChange={handleInputChange}
              placeholder="Nombre del producto"
            />
          </label>

          <label className="detail-item">
            <strong>Precio</strong>
            <input
              type="number"
              name="precio"
              value={nuevoProducto.precio}
              onChange={handleInputChange}
              placeholder="Precio del producto"
            />
          </label>

          <label className="detail-item">
            <strong>Descripción del bloque</strong>
            <input
              type="text"
              name="descripcion"
              value={nuevoProducto.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción del producto"
            />
          </label>
        </div>
      </div>

      {/* Botón de actualización */}
      <div >
        <button className="button modify-button" onClick={addNuevoProducto}>
          Agregar Producto
        </button>
      </div>
    </div>
  );
};

export default NaturalezaPage;

