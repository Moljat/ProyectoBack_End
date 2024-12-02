import React from 'react';
import { useProducto } from './ProductoContext';
import { useEffect, useState } from 'react';
import './AgregarModificar.css';
import { useNavigate } from 'react-router-dom';

const VerProductoPage = () => {
  const { productoSeleccionado } = useProducto();
  const id = productoSeleccionado;
  const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [IsUpdating,  setIsUpdating] = useState(false);

  console.log('productoSeleccionado:', productoSeleccionado);

  useEffect(() => {
    
    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/productos/${id}`);
        const data = await response.json();
        setProducto(data);
        console.log('Producto:', data); 
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    fetchProducto();
  }, [id]);

  const ModificarProducto = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch(`http://localhost:3001/api/v1/productos/${producto.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: producto.nombre,
          price: parseFloat(producto.price),
          descripcion: producto.descripcion,
        }),
      });

      if (response.ok) {
        const updatedProducto = await response.json();
        setProducto(updatedProducto); // Actualiza el estado con el producto actualizado
        alert('Producto actualizado exitosamente');
      } else {
        alert('Error al actualizar el producto');
      }
    } catch (error) {
      console.error('Error al hacer la llamada PATCH:', error);
      console.log(IsUpdating);
    } finally {
      setIsUpdating(false);
    }
  };

  const eliminarProducto = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/productos/${producto.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Producto eliminado correctamente');
        // Puedes realizar alguna acción adicional como redirigir o limpiar el estado
        setProducto(null); 
        navigate('/');// Limpia el producto en el estado
       
      } else {
        console.error('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };


  if (!producto) {
    return <div>Cargando...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProducto((prevProducto) => ({
      ...prevProducto,
      [name]: value,
    }));
  };
 

  return (
    <div className="producto-detalle" style={{
      paddingTop: '100px',
    }}>
      
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
          value={producto.nombre}
          onChange={handleInputChange}
        />
      </label>
      
      <label className="detail-item">
        <strong>Precio</strong>
        <input
          type="number" 
          name="precio"
          value={producto.price}
          onChange={handleInputChange}
        />
      </label>
      
      <label className="detail-item">
        <strong>Descripción del bloque</strong>
        <input
          type="text"
          name="descripcion"
          value={producto.descripcion}
          onChange={handleInputChange}
        />
      </label>
                    
                </div>
            </div>

            <div className='CrudDiv'>

            <button onClick={ModificarProducto}>
                Modificar
                </button>

            <button onClick={eliminarProducto}
            >
                Eliminar
                </button>
            
            </div>

            
           
        </div> 
    
  );
};

export default VerProductoPage;