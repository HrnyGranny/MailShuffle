const mongoose = require("mongoose");

const PremiumEmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Correo asignado
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Relación con el usuario
});

// Crear el modelo correctamente con el nombre `PremiumEmail`
const PremiumEmail = mongoose.model("PremiumEmail", PremiumEmailSchema, "PremiumEmails");

module.exports = PremiumEmail;
