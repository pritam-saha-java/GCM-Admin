import axios from "axios";

// Set the base URL from environment variables
const BASE_URL = import.meta.env.VITE_API_URL;

export const adminLogin = async (credentials) => {
  const response = await axios.post(`${BASE_URL}/api/auth/admin/signin`, credentials);
  return response.data;
};