const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mailgunWebhook = require('./routes/mailgunWebhook');

// Cargar las variables de entorno
dotenv.config();

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Crear la aplicación Express
const app = express();

// Middleware para procesar el cuerpo de la solicitud (JSON)
app.use(bodyParser.json());

// Usar la ruta del webhook de Mailgun
app.use('/webhook', mailgunWebhook);

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
