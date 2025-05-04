const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/authMiddleware");

// Registro de usuario premium
router.post("/register", async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        if (!fullName || !username || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Comprobar duplicados
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "El email o username ya está en uso" });
        }

        const user = new User({ fullName, username, email, password });
        await user.save();
        res.json({ message: "Usuario registrado", apiKey: user.apiKey });
    } catch (err) {
        res.status(400).json({ message: "Error al registrar usuario" });
    }
});

// Login de usuario
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Credenciales incorrectas" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, apiKey: user.apiKey });
    } catch (err) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Obtener usuario por id (protegido)
router.get("/user/:id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener usuario" });
    }
});

module.exports = router;