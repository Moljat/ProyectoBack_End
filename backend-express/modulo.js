const express = require('express');
const bodyParser = require('body-parser');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();//PRISMAAAAAAAAAAAAAA
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());


/******************************************************************************** */

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
/**************************************************************************************** */
// (GET) Consulta de todos los elementos
app.get('/api/v1/productos', async(req, res) => {
    try {
        //Uso del ORM para  hace un query  a todos  los datos  de la tabla
        const items = await prisma.cubitos.findMany();

        if (!items || items.length === 0) {
            return res.status(404).json({ message: 'No se encontraron elementos' });
        }
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los elementos' });
        
    }
});

// (GET) Consulta de un sólo elemento a través de un id
app.get('/api/v1/productos:id', async (req, res) => {
    const {id} = req.params;
    try {
        //ORM para query de un solo elemento
        const item = await prisma.cubitos.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        
        if (!item) {
            return res.status(404).json({ message: 'Elemento no encontrado' });
        }

            


        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el elemento' });
    }
});

// (POST) Agregar un elemento al JSON
app.post('/api/v1/productos', async (req, res) => {
   // Campos para insertar 
   const { nombre, descripcion, price } = req.body;

   try {
      
       
      
       // Insertar en la base de datos usando Prisma
       const newItem = await prisma.cubitos.create({
           data: {
               nombre,
               descripcion,
               price,
           },
       });

       // Responder con el nuevo producto insertado
       res.status(201).json(newItem);
   } catch (error) {
       console.error(error); // Imprimir error detallado
       res.status(500).json({ error: 'Error al agregar el elemento', details: error.message });
   }
});



// (PATCH) Modificar un sólo elemento a través de un id
app.patch('/api/v1/productos:id', async (req, res) => {
    const {id} = req.params;

    //Cmapos para recibir la info actualizado
    const {nombre, descripcion,price} = req.body;


    try {

        //ORM PARA MODIFICAR
        const updateItem = await prisma.cubitos.update({
            where: {
                id: parseInt(id),
            },
            data: {
                //Si esta el valor no hay no lo toma en cuenta pa la modificacion
                //Es decir solo modifica lo que se cmabio 
                ...(nombre !== undefined && {nombre}),
                ...(descripcion !== undefined && {descripcion}),
                ...(price !== undefined && {price}),
            },
        });

        res.json(updateItem);
        res.status(200).json({ message: 'Elemento actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el elemento' });
        
    }
});

// (DELETE) Borrar un elemento a través de un id
app.delete('/api/v1/productos:id', async (req, res) => {
    const {id} = req.params;
    try {
        await prisma.cubitos.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).json({ message: 'Elemento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el elemento' });
        
    } // No content
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
