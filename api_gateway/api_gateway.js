const express = require('express');
const axios = require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();
const cors = require('cors');  // Asegúrate de que cors esté importado correctamente

const app = express();
app.use(express.json()); // Middleware para analizar los datos
app.use(cors()); // Habilitar CORS

// Constantes para los endpoints externos
const USERS_REST_URL = `${process.env.USER_SERVICE_URL}/api/v1/users/`;
const REST_URL = `${process.env.PRODUCT_SERVICE_URL}/api/v1/productos/`;

// Proxy para user-service (Usuarios)
app.use('/api/v1/users', createProxyMiddleware({
    target: USERS_REST_URL, // Enruta a http://localhost:3002
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        const token = req.headers['authorization'];
        if (token) {
            proxyReq.setHeader('Authorization', token); // Pasar el token al microservicio
        }
    }
}));

// Proxy para db-service (Productos)
app.use('/api/v1/productos', createProxyMiddleware({
    target: REST_URL, // Enruta a http://localhost:3001
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        const token = req.headers['authorization'];
        if (token) {
            proxyReq.setHeader('Authorization', token); // Pasar el token al microservicio
        }
    }
}));

// Función para manejar el inicio de sesión (login)
app.post('/api/v1/login', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.USER_SERVICE_URL}/api/v1/login`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: 'Error interno del servidor',
            details: error.response?.data || error.message,
        });
    }
});

// Función para refrescar el token
app.post('/api/v1/refresh', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.USER_SERVICE_URL}/api/v1/token/refresh`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || {
            error: 'Error interno del servidor' });
    }
});

// Iniciar el servidor

app.listen(8001, () => console.log('User service corriendo en http://localhost:8001'));
