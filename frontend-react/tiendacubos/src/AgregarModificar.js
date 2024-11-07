import React from 'react';
import './AgregarModificar.css'; // Archivo CSS externo

const AgregarModificar = () => {
    return (
        <div className="container">
            {/* Título */}
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
                    <p className="detail-item"><strong>Nombre del bloque</strong></p>
                    <p className="detail-item"><strong>Precio</strong></p>
                    <p className="detail-item"><strong>Descripción del bloque</strong></p>
                </div>
            </div>

            {/* Botones */}
            <div className="buttons">
                <button className="button modify-button">Modificar Cubo</button>
                <button className="button delete-button">Eliminar cubo</button>
            </div>
        </div>
    );
};

export default AgregarModificar;
