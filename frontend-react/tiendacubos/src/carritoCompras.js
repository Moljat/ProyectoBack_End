import React, { useState, useEffect } from 'react';

const CarritoCompras = () => {
    const [carrito, setCarrito] = useState([]);
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/chat/');

    useEffect(() => {
        socket.onopen = function () {
            console.log('Conexión abierta');
        };

        socket.onmessage = function (event) {
            const data = JSON.parse(event.data);
            console.log('Mensaje recibido:', data.mensaje.producto);
            
            // Asegúrate de que el mensaje contiene un producto antes de agregarlo al carrito
            if (data.mensaje.producto) {
                console.log('Producto recibido:', data.mensaje.producto);
                setCarrito((carritoActual) => [...carritoActual, data.mensaje.producto]);
            }
        };

        socket.onclose = function () {
            console.log('Conexión cerrada');
        };

        // Cleanup: cierra el socket cuando el componente se desmonta
        return () => socket.close();
    }, []);

   

    return (
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
    );   
};

export default CarritoCompras;
