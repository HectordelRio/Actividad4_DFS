const mongoose = require('mongoose');
require('dotenv').config();

const conectarDB = async () => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Conectado a MongoDB Compass (Local)');
  } catch (error) {
    console.error(' Error de conexión:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;