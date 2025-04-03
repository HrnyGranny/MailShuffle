const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
    const token = req.header("Authorization");
    const apiKey = req.header("x-api-key");
    
    if (token) {
        try {
            const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
            req.user = verified;
            return next();
        } catch (err) {
            return res.status(400).json({ message: "Token inválido" });
        }
    }
    
    if (apiKey) {
        const email = await Email.findOne({ apiKey });
        if (!email) return res.status(401).json({ message: "API Key inválida o expirada" });
        req.apiKey = apiKey;
        return next();
    }
    
    return res.status(401).json({ message: "Acceso denegado" });
};