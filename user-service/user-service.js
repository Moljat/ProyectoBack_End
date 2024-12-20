const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Generar tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

// Registro de usuario
app.post('/api/v1/users', async (req, res) => {
    const { usuario, contrasena, correo } = req.body;

    if (!usuario || !contrasena || !correo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const user = await prisma.usuarios.create({
            data: {
                usuario,
                contrasena: hashedPassword,
                correo,
            },
        });
        res.status(201).json({ message: 'Usuario registrado correctamente', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// Modificar un usuario por ID
app.patch('/api/v1/users/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario, contrasena, correo } = req.body;

    try {
        const user = await prisma.usuarios.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Si hay una nueva contraseña, la ciframos
        const updatedData = {
            usuario: usuario || user.usuario,
            correo: correo || user.correo,
            contrasena: contrasena ? await bcrypt.hash(contrasena, 10) : user.contrasena, // Si la contraseña no se actualiza, no la modificamos
        };

        const updatedUser = await prisma.usuarios.update({
            where: { id: parseInt(id) },
            data: updatedData,
        });

        res.json({ message: 'Usuario actualizado', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al modificar el usuario' });
    }
});

// Eliminar un usuario por ID
app.delete('/api/v1/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.usuarios.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await prisma.usuarios.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

// Consultar todos los usuarios
app.get('/api/v1/users', async (req, res) => {
    try {
        const users = await prisma.usuarios.findMany();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

// Consultar un solo usuario por ID
app.get('/api/v1/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.usuarios.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
});

// Login
app.post('/api/v1/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    try {
        const user = await prisma.usuarios.findUnique({
            where: { correo },
        });

        if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const tokens = generateTokens(user);
        res.json(tokens);
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
});

// Refresh token
app.post('/api/v1/token/refresh', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token requerido' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Refresh token inválido' });
        res.json({ accessToken: jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }) });
    });
});
      
// Verificar token
app.post('/api/v1/token/access', (req, res) => {
    const { accessToken } = req.body;

    if (!accessToken) {
        return res.status(401).json({ error: 'Access token requerido' });
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) {
            return res.status(403).json({ error: 'Access token inválido' });
        }
        res.sendStatus(200);
    });
});

app.listen(3002, () => console.log('User service corriendo en http://localhost:3002'));
