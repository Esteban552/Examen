// backend/Apis/Ejercicios.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Tu conexión a MySQL

// RUTA: GET /api/ejercicios
// Obtiene toda la lista de ejercicios disponibles
router.get('/', async (req, res) => {
    try {
        const [ejercicios] = await db.query('SELECT * FROM ejercicios');
        res.json(ejercicios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener ejercicios' });
    }
});

module.exports = router;