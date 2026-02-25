const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secreto', { expiresIn: '24h' });
        res.json({ token, msg: "Login exitoso" });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = new User({ email, password });
        await user.save();
        res.json({ msg: "Usuario creado" });
    } catch (err) {
        res.status(500).json({ msg: "Error al registrar" });
    }
};