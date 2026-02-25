const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');
const Product = require('./models/Product'); 
const User = require('./models/User');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log(' Conectado a MongoDB Atlas');
        
        
        const adminExist = await User.findOne({ email: 'admin@test.com' });
        if (!adminExist) {
            const hashedPassword = await bcrypt.hash('123', 10);
            await User.create({ username: 'admin', email: 'admin@test.com', password: hashedPassword });
        }

        
        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.create([
                { name: "iPhone 15 Pro", price: 22000, category: "Celulares" },
                { name: "MacBook Air M2", price: 18500, category: "Laptops" },
                { name: "AirPods Pro", price: 4500, category: "Audio" }
            ]);
            console.log(' Productos de prueba generados');
        }
    });


app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/productRoutes'));

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server en puerto ${PORT}`));
}