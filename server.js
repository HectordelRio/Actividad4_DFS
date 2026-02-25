const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Modelos (Definidos aquí mismo para evitar errores de ruta)
const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Conexión y Creación de Usuario
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ Conectado a MongoDB Atlas');
        
        // Borramos si existe y lo creamos de nuevo para asegurar contraseña '123'
        await User.deleteOne({ email: 'admin@test.com' });
        const hashedPassword = await bcrypt.hash('123', 10);
        await User.create({
            username: 'admin',
            email: 'admin@test.com',
            password: hashedPassword
        });
        console.log('👤 Usuario admin@test.com restablecido (Pass: 123)');
    })
    .catch(err => console.error('❌ Error de conexión:', err));

// --- RUTA DE LOGIN ---
const jwt = require('jsonwebtoken');
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token, user: { username: user.username } });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(` Server en puerto ${PORT}`));