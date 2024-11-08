import React, { useState } from 'react';
import './AgregarModificar.css';

const AgregarModificar = ({ onAddCube }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleAddCube = () => {
        const newCube = { name, price, description, image };
        onAddCube(newCube);

        // Limpiar los campos de entrada después de agregar
        setName('');
        setPrice('');
        setDescription('');
        setImage(null);
    };

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
                    {image ? (
                        <img src={image} alt="Cube" className="cube-preview" />
                    ) : (
                        <div className="cube"></div>
                    )}
                </div>

                {/* Detalles del cubo */}
                <div className="cube-details">
                    <label className="detail-item">
                        <strong>Nombre del bloque</strong>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <label className="detail-item">
                        <strong>Precio</strong>
                        <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </label>
                    <label className="detail-item">
                        <strong>Descripción del bloque</strong>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <label className="detail-item">
                        <strong>Imagen</strong>
                        <input type="file" onChange={handleImageUpload} />
                    </label>
                </div>
            </div>

            {/* Botones */}
            <div className="buttons">
                <button className="button modify-button" onClick={handleAddCube}>
                    Agregar Cubo
                </button>
            </div>
        </div>
    );
};

export default AgregarModificar;
