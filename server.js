const express = require('express');
const conectarDB = require('./config/db');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Conectar DB (Solo si no es test)
if (process.env.NODE_ENV !== 'test') {
    conectarDB().then(() => crearUsuarioPrueba());
}

// Crear usuario automático para que el login funcione a la primera
async function crearUsuarioPrueba() {
    try {
        const existe = await User.findOne({ email: "admin@test.com" });
        if (!existe) {
            const nuevo = new User({ email: "admin@test.com", password: "123" });
            await nuevo.save();
            console.log("👤 Usuario de prueba creado: admin@test.com / 123");
        }
    } catch (e) { console.log("Usuario de prueba ya listo."); }
}

// Rutas
app.use('/api/auth', require('./routes/auth'));

// Ruta principal para Render
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
}

module.exports = app;