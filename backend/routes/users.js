const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Registro de usuario premium
router.post("/register", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json({ message: "Usuario registrado", apiKey: user.apiKey });
    } catch (err) {
        res.status(400).json({ message: "Error al registrar usuario" });
    }
});

// Login de usuario
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(400).json({ message: "Credenciales incorrectas" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, apiKey: user.apiKey });
    } catch (err) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = router;
