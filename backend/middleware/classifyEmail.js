const PremiumEmail = require("../models/emailu"); // Modelo de emails premium
const TempEmail = require("../models/email"); // Modelo de correos temporales
const UserEmail = require("../models/emailp"); // Modelo de correos premium

const classifyEmail = async (req, res, next) => {
  try {
    const { recipient } = req.body;

    if (!recipient) {
      return res.status(400).json({ message: "Falta destinatario." });
    }

    // Verificar si el destinatario es un correo premium
    const premiumEmail = await PremiumEmail.findOne({ email: recipient });

    if (premiumEmail) {
      req.isPremium = true;
      req.userId = premiumEmail.userId; // Asociar el email al usuario premium
    } else {
      req.isPremium = false;
    }

    next();
  } catch (err) {
    console.error("❌ Error al clasificar el correo:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = classifyEmail;
