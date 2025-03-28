const express = require('express');
const { faker } = require('@faker-js/faker');
const Email = require('../models/email');

const router = express.Router();

// Ruta para recibir correos desde Mailgun
router.post('/mailgun', async (req, res) => {
  try {
    const { sender, recipient, subject, 'body-plain': body } = req.body;

    if (!sender || !recipient || !subject || !body) {
      console.error("❌ Datos incompletos recibidos:", req.body, req.headers);
      return res.status(400).send('Datos incompletos');
    }

    // Crear un nuevo documento de correo
    const newEmail = new Email({
      sender,
      recipient,
      subject,
      body,
    });

    // Guardar el correo en la base de datos
    await newEmail.save();

    console.log(`✅ Correo guardado en MongoDB de ${sender} con asunto: ${subject}, y body: ${body}`);

    // Responder a Mailgun para confirmar la recepción
    res.status(200).send('OK');
  } catch (err) {
    console.error('❌ Error al guardar el correo en la base de datos:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener los correos por recipient
router.get('/emails/:recipient', async (req, res) => {
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
router.delete('/emails/:recipient', async (req, res) => {
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
router.delete('/emails/:id', async (req, res) => {
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
router.get('/generate', (req, res) => {
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
