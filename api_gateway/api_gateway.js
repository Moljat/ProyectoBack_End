const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors'); // Importar CORS
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json()); // Middleware para procesar JSON
app.use(cors()); // Habilitar CORS

// Función para verificar el token de acceso
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener token del encabezado
  
    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido' });
      }
      req.user = decoded; // Puedes acceder al usuario desde `req.user`
      next(); // Continuar con la solicitud
    });
  };

// URLs base para los microservicios
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';

// Función genérica para manejar solicitudes hacia microservicios
const forwardRequest = async (req, res, method, baseUrl, endpoint) => {
    try {
        const response = await axios({
            method,
            url: `${baseUrl}${endpoint}`,
            data: req.body,
            headers: req.headers, // Pasar encabezados (como el token de autorización)
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: 'Error interno del servidor',
            details: error.response?.data || error.message,
        });
    }
};

// **Microservicio de usuarios**
app.post('/api/v1/login', (req, res) => forwardRequest(req, res, 'post', USER_SERVICE_URL, '/api/v1/login'));
app.post('/api/v1/token/refresh', (req, res) => forwardRequest(req, res, 'post', USER_SERVICE_URL, '/api/v1/token/refresh'));
app.post('/api/v1/token/access', (req, res) => forwardRequest(req, res, 'post', USER_SERVICE_URL, '/api/v1/token/access'));
app.get('/api/v1/users', verifyToken,(req, res) => forwardRequest(req, res, 'get', USER_SERVICE_URL, '/api/v1/users'));
app.get('/api/v1/users/:id',  verifyToken,(req, res) => forwardRequest(req, res, 'get', USER_SERVICE_URL, `/api/v1/users/${req.params.id}`));
app.post('/api/v1/users',  verifyToken,(req, res) => forwardRequest(req, res, 'post', USER_SERVICE_URL, '/api/v1/users'));
app.patch('/api/v1/users/:id', verifyToken, (req, res) => forwardRequest(req, res, 'patch', USER_SERVICE_URL, `/api/v1/users/${req.params.id}`));
app.delete('/api/v1/users/:id', verifyToken, (req, res) => forwardRequest(req, res, 'delete', USER_SERVICE_URL, `/api/v1/users/${req.params.id}`));

// **Microservicio de productos**
app.get('/api/v1/productos', (req, res) => forwardRequest(req, res, 'get', PRODUCT_SERVICE_URL, '/api/v1/productos'));
app.get('/api/v1/productos/:id', (req, res) => forwardRequest(req, res, 'get', PRODUCT_SERVICE_URL, `/api/v1/productos/${req.params.id}`));
app.post('/api/v1/productos', (req, res) => forwardRequest(req, res, 'post', PRODUCT_SERVICE_URL, '/api/v1/productos'));
app.patch('/api/v1/productos/:id', (req, res) => forwardRequest(req, res, 'patch', PRODUCT_SERVICE_URL, `/api/v1/productos/${req.params.id}`));
app.delete('/api/v1/productos/:id', (req, res) => forwardRequest(req, res, 'delete', PRODUCT_SERVICE_URL, `/api/v1/productos/${req.params.id}`));

// Servidor en el puerto 8001
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`API Gateway ejecutándose en http://localhost:${PORT}`));
