const express = require("express");
const authenticateToken = require("../middleware/authMiddleware"); // Middleware de autenticación
const EmailPremium = require("../models/emailp"); // Modelo de correos premium

const router = express.Router();

// Proteger todas las rutas con el middleware
router.use(authenticateToken);

// Ruta para crear un nuevo correo premium
router.post("/", async (req, res) => {
  try {
    const { sender, recipient, subject, body } = req.body;

    if (!sender || !recipient || !subject || !body) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Crear el correo premium asociado al usuario autenticado
    const newEmail = new EmailPremium({
      sender,
      recipient,
      subject,
      body,
      userId: req.user.id, // Asociar el correo al usuario autenticado
    });

    await newEmail.save();

    res.status(201).json({ message: "Correo premium creado correctamente", email: newEmail });
  } catch (err) {
    console.error("❌ Error al crear el correo premium:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta para obtener los correos premium por destinatario
router.get("/recipient/:recipient", async (req, res) => {
  try {
    const { recipient } = req.params;

    const emails = await EmailPremium.find({ recipient });

    if (emails.length === 0) {
      return res.status(404).json({ message: "No se encontraron correos para el destinatario especificado." });
    }

    res.status(200).json(emails);
  } catch (err) {
    console.error("❌ Error al obtener los correos premium:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta para borrar todos los correos premium por destinatario
router.delete("/recipient/:recipient", async (req, res) => {
  try {
    const { recipient } = req.params;

    const result = await EmailPremium.deleteMany({ recipient });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No se encontraron correos para el destinatario especificado." });
    }

    res.status(200).json({ message: `Se eliminaron ${result.deletedCount} correos premium para el destinatario ${recipient}.` });
  } catch (err) {
    console.error("❌ Error al borrar los correos premium:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta para borrar un correo premium por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const email = await EmailPremium.findByIdAndDelete(id);

    if (!email) {
      return res.status(404).json({ message: "No se encontró el correo premium con el ID especificado." });
    }

    res.status(200).json({ message: "Correo premium eliminado correctamente.", email });
  } catch (err) {
    console.error("❌ Error al borrar el correo premium:", err);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;