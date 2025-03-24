import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/emails";

// Función para obtener correos por recipient
export const getEmailsByRecipient = async (recipient) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/emails/${recipient}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching emails for recipient:", error);
    throw error;
  }
};

// Función para generar un correo aleatorio
export const generateRandomEmail = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/generate`);
      return response.data; // Devuelve el correo generado como texto
    } catch (error) {
      console.error("Error generating random email:", error);
      throw error;
    }
  };