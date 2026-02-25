const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB Atlas');
        
        
        const adminExist = await User.findOne({ email: 'admin@test.com' });
        if (!adminExist) {
            const hashedPassword = await bcrypt.hash('123', 10);
            await User.create({ username: 'admin', email: 'admin@test.com', password: hashedPassword });
        }
    } catch (err) {
        console.error('❌ Error:', err);
    }
};
connectDB();

//rutas
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
    } catch (err) { res.status(500).json({ msg: 'Error' }); }
});

app.get('/api/products', (req, res) => {
    
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No hay token, permiso denegado' });
    res.json([{ name: 'Producto 1' }]);
});


module.exports = app; 

if (require.main === module) {
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server en puerto ${PORT}`));
}