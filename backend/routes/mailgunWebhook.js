const express = require('express');
const Email = require('../models/email');

const router = express.Router();

// Ruta para recibir correos desde Mailgun
router.post('/mailgun', async (req, res) => {
  try {
    const { sender, recipient, subject, body } = req.body;

    // Crear un nuevo documento de correo
    const newEmail = new Email({
      sender,
      recipient,
      subject,
      body,
    });

    // Guardar el correo en la base de datos
    await newEmail.save();

    console.log(`Correo recibido de ${sender} con asunto: ${subject}`);

    // Responder a Mailgun para confirmar la recepción
    res.status(200).send('OK');
  } catch (err) {
    console.error('Error al recibir el correo:', err);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
