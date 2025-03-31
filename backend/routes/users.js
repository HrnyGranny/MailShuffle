const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware");
const User = require("../models/user");

const router = express.Router();

// Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    // Generar JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (err) {
    console.error("❌ Error al iniciar sesión:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// Registrar usuario
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado correctamente", user: { username, email } });
  } catch (err) {
    console.error("❌ Error al registrar el usuario:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// Middleware para proteger rutas
router.use(authenticateToken);

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Error al obtener los usuarios:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// Obtener usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error al obtener el usuario:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// Actualizar usuario
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario actualizado correctamente", user: updatedUser });
  } catch (err) {
    console.error("❌ Error al actualizar el usuario:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar el usuario:", err);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;
