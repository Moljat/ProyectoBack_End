import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link para la navegación
import './App.css';

const productos = [
  { nombre: 'Mena de carbon', precio: 30.0, imagen: 'imagen_carbon.png' },
  { nombre: 'Mena de cobre', precio: 50.0, imagen: 'imagen_cobre.png' },
  { nombre: 'Mena de hierro', precio: 100.0, imagen: 'imagen_hierro.png' },
  { nombre: 'Mena de oro', precio: 70.0, imagen: 'imagen_oro.png' },
  { nombre: 'Mena de redtone', precio: 80.0, imagen: 'imagen_redtone.png' },
  { nombre: 'Mena de lapislazuli', precio: 55.5, imagen: 'imagen_lapislazuli.png' },
  { nombre: 'Mena de esmeralda', precio: 200.0, imagen: 'imagen_esmeralda.png' },
  { nombre: 'Mena de diamante', precio: 500.0, imagen: 'imagen_diamante.png' },
];

const NaturalezaPage = () => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  return (
    <div className="naturaleza-page">
      <div className="navbar">
        <h1>Tienda de Cubos</h1>
      </div>

      <h2>Naturaleza</h2>

      <div className="productos-grid">
        {/* Botón de navegación en color morado */}
        <Link to="/agregar-modificar">
          <button className="boton-navegar-morado">Ir a Agregar/Modificar Cubo</button>
        </Link>

        {/* Productos */}
        {productos.map((producto, index) => (
          <div key={index} className="producto-card">
            <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
            <p className="producto-nombre">{producto.nombre}</p>
            <p className="producto-precio">${producto.precio.toFixed(2)}</p>
            <button className="boton-agregar" onClick={() => agregarAlCarrito(producto)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      <div className="carrito">
        <h3>Carrito de Compras</h3>
        <ul>
          {carrito.map((item, index) => (
            <li key={index}>
              {item.nombre} - ${item.precio.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NaturalezaPage;
