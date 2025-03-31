const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Emails = require("./routes/emails");
const Users = require("./routes/users");
const Emailsp = require("./routes/emailsp");

// Cargar las variables de entorno
dotenv.config();

// Conectar a la base de datos
mongoose.connect(process.env.MONGODB_URI_EMAILS)
  .then(() => console.log('✅ Conectado a MongoDB - EmailDB'))
  .catch(err => console.error('❌ Error de conexión a MongoDB - EmailDB', err));

// Crear la aplicación Express
const app = express();

// Configurar CORS
app.use(cors());

// Middleware para procesar datos en JSON y URL-encoded con un límite de 10 MB
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rutas
app.use("/api/emails", Emails);
app.use("/api/users", Users);
app.use("/api/emailsp", Emailsp);

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${port}`);
});
