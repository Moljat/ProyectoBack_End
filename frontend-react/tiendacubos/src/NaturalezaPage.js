import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importa Link para la navegación
import './App.css';
import { useProducto } from './ProductoContext';



const productosFijos = [
  { id: 0, nombre: 'Mena de carbon', precio: 30.0, imagen: 'imagen_carbon.png' },
  { id: 0, nombre: 'Mena de cobre', precio: 50.0, imagen: 'imagen_cobre.png' },
  { id: 0, nombre: 'Mena de hierro', precio: 100.0, imagen: 'imagen_hierro.png' },
  { id: 0, nombre: 'Mena de oro', precio: 70.0, imagen: 'imagen_oro.png' },
  { id: 0, nombre: 'Mena de redstone', precio: 80.0, imagen: 'imagen_redstone.png' },
  { id: 0, nombre: 'Mena de lapislazuli', precio: 55.5, imagen: 'imagen_lapislazuli.png' },
  { id: 0, nombre: 'Mena de esmeralda', precio: 200.0, imagen: 'imagen_esmeralda.png' },
  { id: 0, nombre: 'Mena de diamante', precio: 500.0, imagen: 'imagen_diamante.png' },
];

const NaturalezaPage = () => {
  const [productos, setProductos] = useState(productosFijos); // Productos iniciales
  const { setProductoSeleccionado } = useProducto();
  const socket = new WebSocket('ws://127.0.0.1:8000/ws/chat/');

socket.onopen = function () {
  console.log('WebSocket conectado');
};

// Manejo de errores en caso de que el WebSocket se desconecte
socket.onclose = function () {
  console.log('WebSocket desconectado');
};



  const agregarAlCarrito = (producto) => {
    // Actualiza el estado del carrito

  
    // Envía el producto al WebSocket en formato JSON
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({mensaje: { producto }}));
      console.log('Producto agregado al carrito:' + JSON.stringify(producto));
    } else {
      console.error('El WebSocket no está conectado.');
    }
  };

 
  
  useEffect(() => {
    async function fetchProductos() {
      try {
        const response = await fetch('http://localhost:3001/api/productos');
        const nuevosProductos = await response.json();
        
        // Combina los productos fijos con los nuevos de la API
        setProductos((prevProductos) => [
          ...prevProductos,
          ...nuevosProductos.map((producto) => ({
            ...producto, // Mantiene las propiedades existentes
            imagen: producto.imagen || 'cubo_default.png', // Asigna la imagen por defecto si no tiene una
          }))
        ]);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    }
  
    fetchProductos();
  }, []);

  

  return (
    <div className="naturaleza-page">
      <div className="navbar">
        <h1>Tienda de Cubos</h1>
      </div>
  
      <h2>Naturaleza</h2>
  
            <div className="productos-grid">
        {productos.map((producto, index) => (
          
          <div key={index} className="producto-card">
            
            <Link to="/VerProducto" className="producto-link" onClick={() => setProductoSeleccionado(producto.id)} 
            >
              <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
              <p className="producto-nombre">{producto.nombre}</p>
              <p className="producto-precio">
                ${producto.precio && !isNaN(producto.precio) ? producto.precio.toFixed(2) : 'N/A'}
              </p>
            </Link>
            <button className="boton-agregar" onClick={(e) => {
              e.stopPropagation(); // Evitar que el clic en el botón dispare el evento del contenedor
              agregarAlCarrito(producto);
            }}>
              Agregar al carrito
            </button>
          </div>
          
        ))}
        

       
        <div className="producto-card boton-morado-card">
          <Link to="/agregar-modificar">
            <button className="boton-navegar-morado">
              <img src="signomas.png" alt="Ir a Agregar/Modificar" className="icono-mas" />
            </button>
          </Link>
        </div>
      </div>

      
    </div>
  );
};

export default NaturalezaPage;
