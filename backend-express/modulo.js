const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta del archivo JSON
const dataFilePath = path.join(__dirname, 'productos.json');

// Función para leer datos del archivo JSON
const readDataFromFile = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// Función para escribir datos en el archivo JSON
const writeDataToFile = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// (GET) Consulta de todos los elementos
app.get('/api/productos', (req, res) => {
    const items = readDataFromFile();
    res.json(items);
});

// (GET) Consulta de un sólo elemento a través de un id
app.get('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const items = readDataFromFile();
    const item = items.find(i => i.id === id);
    
    if (!item) {
        return res.status(404).json({ message: 'Elemento no encontrado' });
    }
    res.json(item);
});

// (POST) Agregar un elemento al JSON
app.post('/api/producto-nuevo', (req, res) => {
    // Acceder al campo "name" de la solicitud
    const newItem = req.body; // Obtiene el cuerpo de la solicitud

    console.log("request: " + JSON.stringify(req.body));

    console.log(newItem);
    // Aquí puedes acceder al "name"
    const productName = newItem.nombre;

    console.log("nombre: " + productName);

    // Verifica si productName existe
    

    
    const items = readDataFromFile();
    newItem.id = items.length ? items[items.length - 1].id + 1 : 1; // Asignar un nuevo ID

    // Limpiar el nombre
    

    // Agregar valores predeterminados para descripción y precio
    newItem.descripcion = newItem.descripcion? newItem.descripcion.trim() : 'Descripción no disponible';
    newItem.precio= newItem.precio !== undefined ? parseFloat(newItem.precio) : 0.00;

    // Agregar el nuevo producto
    items.push(newItem);
    writeDataToFile(items);

    // Responder con el nuevo producto
    res.status(201).json(newItem);
});



// (PATCH) Modificar un sólo elemento a través de un id
app.patch('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const items = readDataFromFile();
    const index = items.findIndex(i => i.id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: 'Elemento no encontrado' });
    }
    
    // Actualizar el elemento con los datos enviados
    items[index] = { ...items[index], ...req.body };
    writeDataToFile(items);
    res.json(items[index]);
});

// (DELETE) Borrar un elemento a través de un id
app.delete('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const items = readDataFromFile();
    const index = items.findIndex(i => i.id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: 'Elemento no encontrado' });
    }
    
    items.splice(index, 1);
    writeDataToFile(items);
    res.status(204).send(); // No content
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
