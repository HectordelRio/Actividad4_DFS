const express = require('express');
const conectarDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

if (process.env.NODE_ENV !== 'test') {
    conectarDB().catch(err => console.log(err));
}
app.use(express.json()); // Para leer JSON
app.use(express.static('public')); // Para ver el HTML



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


app.use(express.static('public'));
// Definir Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
}

module.exports = app; // Exportamos para los tests