const mongoose = require("mongoose");

// Definir el esquema del correo premium
const emailPremiumSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  subject: String,
  body: String,
  receivedAt: { type: Date, default: Date.now }, // Fecha cuando se recibe el correo
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Asociado a un usuario
});

// Crear el modelo y especificar que use la colección PremiumEmails
const EmailPremium = mongoose.model("EmailPremium", emailPremiumSchema, "UserEmails");

module.exports = EmailPremium;