import React, { createContext, useState, useContext } from 'react';

const ProductoContext = createContext();

export const useProducto = () => useContext(ProductoContext);

export const ProductoProvider = ({ children }) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  return (
    <ProductoContext.Provider value={{ productoSeleccionado, setProductoSeleccionado }}>
      {children}
    </ProductoContext.Provider>
  );
};
