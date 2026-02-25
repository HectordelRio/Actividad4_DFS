const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');


const User = require('./models/User'); 

dotenv.config();
const app = express();


app.use(express.json());
app.use(cors());
app.use(express.static('public')); 


const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'clavesecreta';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('✅ Conectado a MongoDB Atlas');
        
        
        const userExists = await User.findOne({ email: 'admin@test.com' });
        if (!userExists) {
            const hashedPassword = await bcrypt.hash('123', 10);
            await User.create({
                username: 'admin',
                email: 'admin@test.com',
                password: hashedPassword
            });
            console.log('👤 Usuario de prueba creado: admin@test.com / 123');
        }
    })
    .catch(err => console.error('❌ Error de conexión:', err));



//ogin
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Registro 
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ msg: 'Usuario registrado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor listo en puerto ${PORT}`);
});