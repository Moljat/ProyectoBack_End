const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// Proxy para user-service
app.use('/api/v1/users', createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
}));

// Proxy para db-service
app.use('/api/v1/productos', createProxyMiddleware({
    target: process.env.BACKEND_EXPRESS_URL,
    changeOrigin: true,
}));

app.listen(process.env.PORT, () => {
    console.log(`API Gateway corriendo en http://localhost:${process.env.PORT}`);
});
