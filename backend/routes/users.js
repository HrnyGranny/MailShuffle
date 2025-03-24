const express = require('express');
const User = require('../models/user');  // Importar el modelo de usuario
const bcrypt = require('bcryptjs');  // Para cifrar contraseñas
const router = express.Router();

// Método POST para crear un nuevo usuario
router.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el correo ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Cifrar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
  } catch (err) {
    console.error('Error al crear el usuario:', err);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
});

// Método GET para obtener todos los usuarios
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Obtener todos los usuarios
    res.status(200).json(users);
  } catch (err) {
    console.error('Error al obtener los usuarios:', err);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

// Método GET para obtener un usuario por ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error al obtener el usuario:', err);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});

// Método PUT para actualizar un usuario por ID
router.put('/users/:id', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Si se actualiza la contraseña, cifrarla antes de actualizar
    let updatedData = { username, email };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    // Actualizar el usuario
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.status(200).json({ message: 'Usuario actualizado con éxito', user: updatedUser });
  } catch (err) {
    console.error('Error al actualizar el usuario:', err);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

// Método DELETE para eliminar un usuario por ID
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (err) {
    console.error('Error al eliminar el usuario:', err);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
});

module.exports = router;
