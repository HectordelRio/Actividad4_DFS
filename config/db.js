const mongoose = require('mongoose');
require('dotenv').config(); // Agrega esta línea aquí arriba

const conectarDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ Error: MONGO_URI no está definida en el .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Conectado...');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;