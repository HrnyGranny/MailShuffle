import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/emails";

// Función para obtener la bandeja de entrada
export const getInbox = async (email, apiKey) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inbox`, {
      params: { email, apiKey },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching inbox:", error);
    throw error;
  }
};

// Función para generar un correo temporal
export const generateTemporalEmail = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-temporal`);
    return response.data; // Devuelve el correo generado, API Key y fecha de expiración
  } catch (error) {
    console.error("Error generating temporal email:", error);
    throw error;
  }
};

// Función para generar un correo permanente (requiere autenticación)
export const generatePermanentEmail = async (token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/generate-permanent`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; // Devuelve el correo generado y la API Key
  } catch (error) {
    console.error("Error generating permanent email:", error);
    throw error;
  }
};

// Función para eliminar un correo específico
export const deleteEmailById = async (email, apiKey, emailId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/e/delete-email`, {
      data: { email, apiKey, emailId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting email by ID:", error);
    throw error;
  }
};

// Función para eliminar una dirección de correo por ID
export const deleteEmailAddress = async (id, apiKey) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/a/delete-address`, {
      data: { id, apiKey },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting email address:", error);
    throw error;
  }
};