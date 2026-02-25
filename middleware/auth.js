const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token'); S
    if (!token) return res.status(401).json({ msg: 'No hay token, permiso denegado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_provisional');
        req.user = decoded; 
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token no es válido' });
    }
};