const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Emails = require('./routes/emails');
const Users = require('./routes/users');

// Cargar las variables de entorno
dotenv.config();

// Conexión a EmailDB (base de datos de correos)
mongoose.connect(process.env.MONGODB_URI_EMAILS)
  .then(() => console.log('✅ Conectado a MongoDB - EmailDB'))
  .catch(err => console.error('❌ Error de conexión a MongoDB - EmailDB', err));

// Conectar a la base de datos UsersDB (base de datos de usuarios)
const mongooseUsers = mongoose.createConnection(process.env.MONGODB_URI_USERS);
mongooseUsers.once('open', () => console.log('✅ Conectado a MongoDB - UsersDB'));
mongooseUsers.on('error', err => console.error('❌ Error de conexión a UsersDB:', err));

// Crear la aplicación Express
const app = express();

// Configurar CORS
app.use(cors());

// Middleware para procesar datos en JSON y URL-encoded con un límite de 10 MB
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 

// Rutas
app.use('/api/emails', Emails);
app.use('/api/users', Users);

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
