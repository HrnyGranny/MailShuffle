const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const EmailSchema = new Schema({
    address: { type: String, required: true, unique: true },  // Dirección de correo única
    owner: { type: Schema.Types.ObjectId, ref: "User", default: null },  // Propietario (solo para usuarios premium)
    expiresAt: { type: Date, default: null }, // Fecha de expiración (si aplica)
    apiKey: { type: String, default: null },  // API Key (para correos temporales)
    inbox: [{ sender: String, subject: String, body: String, receivedAt: Date }] // Bandeja de entrada
});

// Indices para TTL de correos temporales (expiración de 7 días)
EmailSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model("Email", EmailSchema, "Emails");