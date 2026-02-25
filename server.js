const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');


dotenv.config();


const User = require('./models/User');
const productRoutes = require('./routes/productRoutes');

const app = express();


app.use(express.json()); 
app.use(cors());        
app.use(express.static('public')); 


const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log(' Conectado a MongoDB Atlas');

       
        const adminExist = await User.findOne({ email: 'admin@test.com' });
        if (!adminExist) {
            const hashedPassword = await bcrypt.hash('123', 10);
            await User.create({
                username: 'admin',
                email: 'admin@test.com',
                password: hashedPassword
            });
            console.log('👤 Usuario admin@test.com creado (Pass: 123)');
        }
    })
    .catch(err => console.error('❌ Error de conexión:', err));


const authController = require('./controllers/authController'); 
app.post('/api/auth/login', authController.login);


app.use('/api/products', productRoutes);


module.exports = app;


if (require.main === module) {
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Servidor listo en puerto ${PORT}`);
    });
}