// routes/emails.js
const express = require('express');
const { faker } = require('@faker-js/faker');
const crypto = require('crypto');
const Email = require('../models/email');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware de autenticación
const router = express.Router();

// Ruta para recibir correos desde Mailgun
router.post('/mailgun', async (req, res) => {
    try {
        const { 
            recipient, 
            sender, 
            subject, 
            'body-plain': bodyPlain, 
            'body-html': bodyHtml 
        } = req.body; // Datos enviados por Mailgun

        // Buscar el correo en la base de datos (mayus/minus)
        const emailDoc = await Email.findOne({ address: new RegExp(`^${recipient}$`, 'i') });

        // Si no se encuentra el correo, devolver un error
        if (!emailDoc) {
            return res.status(404).json({ message: "Correo no encontrado" });
        }

        // Verificar si el correo ha expirado (solo para correos temporales)
        if (emailDoc.expiresAt && new Date() > emailDoc.expiresAt) {
            return res.status(410).json({ message: "El correo ha expirado" });
        }

        // Agregar el correo recibido a la bandeja de entrada
        emailDoc.inbox.push({
            sender: sender,
            subject: subject,
            body: bodyHtml || bodyPlain, // Preferir HTML si está disponible, texto plano como respaldo
            receivedAt: new Date()
        });

        // Guardar los cambios en la base de datos
        await emailDoc.save();

        // Responder con éxito
        res.status(200).json({ message: "Correo recibido y almacenado correctamente" });
    } catch (err) {
        console.error('❌ Error al procesar el correo recibido:', err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta para generar un correo aleatorio con el dominio mailshuffle.xyz
router.post('/generate-temporal', async (req, res) => {
    try {
        // Generar una parte aleatoria para el nombre de usuario
        const username = faker.internet.username(); // Nombre de usuario aleatorio
        const email = `${username}@mailshuffle.xyz`; // Concatenamos con el dominio mailshuffle.xyz

        // Generar una API Key única
        const apiKey = crypto.randomBytes(16).toString('hex');

        // Establecer la fecha de expiración para el correo (7 días)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Crear el correo temporal en la base de datos
        const newEmail = new Email({
            address: email,
            apiKey: apiKey,
            expiresAt: expiresAt
        });

        // Guardar el correo en la base de datos
        await newEmail.save();

        // Devolver el correo generado junto con la API Key y la fecha de expiración
        res.status(200).json({_id: newEmail._id, email: email, apiKey: apiKey, expiresAt: expiresAt });
    } catch (err) {
        console.error('❌ Error al generar el correo aleatorio:', err);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para generar un correo permanente para usuarios premium
router.post('/generate-permanent', authMiddleware, async (req, res) => {
    try {
        // Verificar que el usuario está autenticado
        if (!req.user) {
            return res.status(401).json({ message: "Autenticación requerida" });
        }

        // Generar una parte aleatoria para el nombre de usuario
        const username = faker.internet.username(); // Nombre de usuario aleatorio
        const email = `${username}@mailshuffle.xyz`; // Concatenamos con el dominio mailshuffle.xyz

        // Verificar si el usuario ya tiene un correo permanente
        const existingEmail = await Email.findOne({ owner: req.user.id });
        if (existingEmail) {
            return res.status(400).json({ message: "Ya tienes un correo permanente" });
        }

        // Crear el correo permanente en la base de datos
        const newEmail = new Email({
            address: email,
            owner: req.user.id, // Asociar al usuario autenticado
            apiKey: crypto.randomBytes(16).toString('hex'), // Generar una API Key única
            expiresAt: null // No expira
        });

        // Guardar el correo en la base de datos
        await newEmail.save();

        // Devolver el correo generado
        res.status(200).json({ email: email, apiKey: newEmail.apiKey });
    } catch (err) {
        console.error('❌ Error al generar el correo permanente:', err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta para obtener la bandeja de entrada
router.get("/inbox", async (req, res) => {
    try {
        const { email, apiKey, lastEmailId } = req.query; // Obtener la dirección de correo, API Key y el último ID de correo

        // Si el usuario está autenticado (es un usuario premium)
        if (req.user) {
            const emailDoc = await Email.findOne({ address: email, owner: req.user.id });

            if (!emailDoc) {
                return res.status(403).json({ message: "No tienes acceso a esta dirección de correo" });
            }

            // Si se proporciona `lastEmailId`, devolver solo los correos más recientes
            if (lastEmailId) {
                const newEmails = emailDoc.inbox.filter(email => email._id > lastEmailId);
                return res.json(newEmails);
            }

            // Si no se proporciona `lastEmailId`, devolver todos los correos
            return res.json(emailDoc.inbox);
        }

        // Si no está autenticado (es un usuario anónimo), verificar por la API Key
        const emailDoc = await Email.findOne({ address: email, apiKey: apiKey });

        if (!emailDoc) {
            return res.status(404).json({ message: "Correo no encontrado o API Key incorrecta" });
        }

        // Si se proporciona `lastEmailId`, devolver solo los correos más recientes
        if (lastEmailId) {
            const newEmails = emailDoc.inbox.filter(email => email._id > lastEmailId);
            return res.json(newEmails);
        }

        // Si no se proporciona `lastEmailId`, devolver todos los correos
        res.json(emailDoc.inbox);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener los correos" });
    }
});

// ruta para eliminar un correo específico
router.delete('/e/delete-email', async (req, res) => {
    try {
        const { email, apiKey, emailId } = req.body; // Obtener la dirección de correo y la API Key

        // Buscar el correo en la base de datos
        const emailDoc = await Email.findOne({ address: email, apiKey: apiKey });

        // Si no existe el correo o la API Key no es válida
        if (!emailDoc) {
            return res.status(404).json({ message: "Correo no encontrado o API Key incorrecta" });
        }

        // Filtrar los correos para eliminar el específico
        emailDoc.inbox = emailDoc.inbox.filter(mail => mail._id.toString() !== emailId);

        // Guardar los cambios en la base de datos
        await emailDoc.save();

        res.status(200).json({ message: "Correo eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar el correo" });
    }
});

// ruta para eliminar la dirección de correo por ID
router.delete('/a/delete-address', async (req, res) => {
    try {
        const { id, apiKey } = req.body; // Obtener el ID del correo y la API Key

        let emailDoc;

        // Si el usuario está autenticado (usuario premium)
        if (req.user) {
            // Buscar el correo asociado al usuario premium por ID
            emailDoc = await Email.findOne({ _id: id, owner: req.user.id });

            // Si no existe el correo o no pertenece al usuario premium
            if (!emailDoc) {
                return res.status(404).json({ message: "Correo no encontrado o no pertenece a tu cuenta" });
            }
        } else {
            // Si el usuario no está autenticado, verificar por la API Key
            emailDoc = await Email.findOne({ _id: id, apiKey: apiKey });

            // Si no existe el correo o la API Key no es válida
            if (!emailDoc) {
                return res.status(404).json({ message: "Correo no encontrado o API Key incorrecta" });
            }
        }

        // Eliminar el correo de la base de datos
        await Email.deleteOne({ _id: emailDoc._id });

        res.status(200).json({ message: "Correo eliminado correctamente" });
    } catch (err) {
        console.error("Error al eliminar el correo:", err);
        res.status(500).json({ message: "Error al eliminar el correo" });
    }
});

// Ruta para obtener la fecha de expiración de un correo
router.get("/expiration", async (req, res) => {
    try {
        const { email, apiKey } = req.query;  // Obtener la dirección de correo y la API Key

        // Validar que se proporcionaron los parámetros necesarios
        if (!email || !apiKey) {
            return res.status(400).json({ 
                message: "Se requieren parámetros email y apiKey" 
            });
        }

        // Si el usuario está autenticado (es un usuario premium)
        if (req.user) {
            // Buscar el correo asociado al usuario premium
            const emailDoc = await Email.findOne({ 
                address: email, 
                owner: req.user.id 
            });

            // Si no existe o no pertenece al usuario premium, denegar acceso
            if (!emailDoc) {
                return res.status(403).json({ 
                    message: "No tienes acceso a esta dirección de correo" 
                });
            }

            // Si pertenece al usuario premium, devolver la fecha de expiración
            return res.json({ 
                expiresAt: emailDoc.expiresAt,
                isPermanent: emailDoc.expiresAt === null
            });
        }

        // Si no está autenticado (es un usuario anónimo), verificar por la API Key
        const emailDoc = await Email.findOne({ address: email, apiKey: apiKey });

        // Si no existe el correo o la API Key no es válida
        if (!emailDoc) {
            return res.status(404).json({ 
                message: "Correo no encontrado o API Key incorrecta" 
            });
        }

        // Si la dirección de correo temporal existe y la API Key coincide, devolver la fecha de expiración
        res.json({ 
            expiresAt: emailDoc.expiresAt,
            isPermanent: emailDoc.expiresAt === null,
            remainingDays: emailDoc.expiresAt ? 
                Math.max(0, Math.ceil((new Date(emailDoc.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))) : 
                null
        });
    } catch (err) {
        console.error('❌ Error al obtener la fecha de expiración:', err);
        res.status(500).json({ message: "Error al obtener la fecha de expiración" });
    }
});

module.exports = router;

