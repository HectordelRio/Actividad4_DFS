// controllers/authController.js
const User = require('../models/User'); // Asegúrate de que este archivo exista

exports.register = async (req, res) => {
    res.json({ msg: "Ruta de registro funcionando" });
};

exports.login = async (req, res) => {
    res.json({ msg: "Ruta de login funcionando" });
};