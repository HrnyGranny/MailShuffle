const jwt = require("jsonwebtoken");

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificar si el token está presente en el encabezado
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1]; // Extraer el token después de "Bearer"

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardar los datos del usuario en la solicitud
    next(); // Continuar con la siguiente función
  } catch (err) {
    console.error("❌ Error al verificar el token:", err);
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
};

module.exports = authenticateToken;