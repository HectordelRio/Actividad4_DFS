const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

// Obtener todos los productos
router.get('/', auth, async (req, res) => {
    try {
        const productos = await Product.find();
        res.json(productos); // Aquí es donde se envían al HTML
    } catch (err) {
        res.status(500).json({ msg: 'Error al cargar productos' });
    }
});

module.exports = router;