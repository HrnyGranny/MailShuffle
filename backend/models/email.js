const mongoose = require('mongoose');

// Definir el esquema del correo
const emailSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  subject: String,
  body: String,
  receivedAt: { type: Date, default: Date.now }, // Fecha cuando se recibe el correo
});

// Crear un índice TTL en el campo `receivedAt` para que los documentos expiren después de 3 días (259200 segundos)
emailSchema.index({ receivedAt: 1 }, { expireAfterSeconds: 259200 }); // 3 días = 259200 segundos

// Crear el modelo y especificar que use la colección TempEmails
const Email = mongoose.model('Email', emailSchema, 'TempEmails');

module.exports = Email;
