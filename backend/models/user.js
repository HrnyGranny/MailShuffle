const mongoose = require('mongoose');

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Crear el modelo de usuario y especificar que use la colección AllUsers
const User = mongoose.model('User', userSchema, 'AllUsers');

module.exports = User;
