"use client";

import { useState } from "react";


const NaturalezaPage = () => {
  // Estado para el nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: null,
  });

  // Función para manejar los cambios en los inputs de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({
      ...nuevoProducto,
      [name]: value,
    });
  };

  // Función para manejar la selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNuevoProducto({
      ...nuevoProducto,
      imagen: file,
    });
  };

  // Función para agregar un nuevo producto
  const addNuevoProducto = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/v1/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nuevoProducto.nombre,
          descripcion: nuevoProducto.descripcion,
          price: parseFloat(nuevoProducto.precio),
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al agregar el producto');
      }
  
      const productoAgregado = await response.json();
      console.log('Producto agregado:', productoAgregado);
    } catch (error) {
      console.error('Error al hacer la llamada POST:', error);
    }
  };
  

  return (
    <div
      className="producto-detalle"
      style={{
        paddingTop: "100px",
      }}
    >
      <header className="header">
        <h1>TIENDA DE CUBOS</h1>
        
      </header>

      <div className="content">
        <div className="cube-details">
          <label className="detail-item">
            <strong>Nombre del producto</strong>
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
            <strong>Descripción</strong>
            <input
              type="text"
              name="descripcion"
              value={nuevoProducto.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción del producto"
            />
          </label>

          <label className="detail-item">
            <strong>Imagen</strong>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
      </div>

      <div>
        <button className="button modify-button" onClick={addNuevoProducto}>
          Agregar Producto
        </button>
      </div>
    </div>
  );
};

export default NaturalezaPage;
