const express = require('express');
const conectarDB = require('./config/db'); // Revisa que esta ruta sea correcta
const User = require('./models/User');    // Revisa que esta ruta sea correcta
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// --- FUNCIONES AUXILIARES ---

// Esta función crea el usuario si no existe para que el botón de login funcione
async function crearUsuarioPrueba() {
    try {
        const existe = await User.findOne({ email: "admin@test.com" });
        if (!existe) {
            const nuevo = new User({ email: "admin@test.com", password: "123" });
            // El modelo User se encarga de encriptar la clave 123
            await nuevo.save();
            console.log("👤 Usuario de prueba creado: admin@test.com / 123");
        } else {
            console.log("✅ Usuario de prueba ya existe en la base de datos.");
        }
    } catch (e) {
        console.log("⚠️ No se pudo crear/verificar el usuario de prueba:", e.message);
    }
}

// --- RUTAS ---
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// --- ARRANQUE DEL SERVIDOR ---
const iniciarApp = async () => {
    try {
        // En Render o Local, intentamos conectar a la BD
        if (process.env.NODE_ENV !== 'test') {
            await conectarDB();
            await crearUsuarioPrueba();
        }
    } catch (error) {
        console.error("❌ Falló la conexión inicial, pero el servidor intentará subir igual:", error.message);
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor listo en puerto ${PORT}`);
    });
};

iniciarApp();

module.exports = app;