import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/users";

// Registro de usuario premium
export const registerUser = async ({ fullName, username, email, password }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      fullName,
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al registrar usuario" };
  }
};

// Login de usuario
export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al iniciar sesión" };
  }
};

// Obtener usuario por id (requiere token)
export const getUserById = async (id, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener usuario" };
  }
};