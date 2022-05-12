const e = require('express');
const express = require('express');
var cors = require('cors')
require('dotenv').config();
const {dbConnection} = require('./database/config');


// Crear el servidor de express
const app = express();

app.use(cors());

dbConnection();

//Directorio public
app.use(express.static('public'));

//Lectura y parseo de body
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


// Escuchar peticiones

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});