const express = require('express');
const { faker } = require('@faker-js/faker');
const Email = require('../models/email');
const UserEmail = require('../models/emailp'); // Correos premium
const classifyEmail = require("../middleware/classifyEmail");

const router = express.Router();

// Ruta para recibir correos desde Mailgun

router.post('/mailgun', classifyEmail, async (req, res) => {
  try {
    const { sender, recipient, subject, 'body-plain': body } = req.body;

    if (!sender || !recipient || !subject || !body) {
      return res.status(400).send("Datos incompletos");
    }

    if (req.isPremium) {
      const newEmail = new UserEmail({ sender, recipient, subject, body, userId: req.userId });
      await newEmail.save();
      console.log(`✅ Email Premium guardado para usuario ${req.userId}`);
    } else {
      const newEmail = new Email({ sender, recipient, subject, body });
      await newEmail.save();
      console.log(`✅ Email Temporal guardado`);
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Error al guardar el correo:", err);
    res.status(500).send("Error interno del servidor");
  }
});


// Ruta para obtener los correos por recipient
router.get('/:recipient', async (req, res) => {
  try {
    const { recipient } = req.params;

      // Buscar los correos en la base de datos que coincidan con el recipient (case-insensitive)
      const emails = await Email.find({ recipient: { $regex: new RegExp(`^${recipient}$`, 'i') } });

    if (emails.length === 0) {
      return res.status(404).json({ message: 'No se encontraron correos para este destinatario.' });
    }

    res.status(200).json(emails);
  } catch (err) {
    console.error('❌ Error al obtener los correos:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para borrar los correos por recipient
router.delete('/:recipient', async (req, res) => {
  try {
    const { recipient } = req.params;

    // Borrar los correos en la base de datos que coincidan con el recipient (case-insensitive)
    const result = await Email.deleteMany({ recipient: { $regex: new RegExp(`^${recipient}$`, 'i') } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No se encontraron correos para borrar.' });
    }

    res.status(200).json({ message: 'Correos borrados correctamente.' });
  } catch (err) {
    console.error('❌ Error al borrar los correos:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para borrar un correo específico por su _id
router.delete('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar y borrar el correo por su _id
    const result = await Email.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'No se encontró el correo con el ID proporcionado.' });
    }

    res.status(200).json({ message: 'Correo borrado correctamente.' });
  } catch (err) {
    console.error('❌ Error al borrar el correo:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para generar un correo aleatorio con el dominio mailshuffle.online
router.get('/g/generate', (req, res) => {
  try {
    // Generar una parte aleatoria para el nombre de usuario
    const username = faker.internet.username(); // Nombre de usuario aleatorio
    const email = `${username}@mailshuffle.xyz`; // Concatenamos con el dominio mailshuffle.online

    // Devolver solo el correo generado como texto plano
    res.status(200).send(email);
  } catch (err) {
    console.error('❌ Error al generar el correo aleatorio:', err);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
