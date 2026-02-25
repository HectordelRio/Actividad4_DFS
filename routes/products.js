const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No hay token, permiso denegado' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) { res.status(400).json({ msg: 'Token no válido' }); }
};


router.get('/', authMiddleware, (req, res) => {
    res.json({ msg: 'Bienvenido al inventario de productos' });
});

module.exports = router;