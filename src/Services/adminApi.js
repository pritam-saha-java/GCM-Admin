import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const adminApi = axios.create({
  baseURL: API_URL,
});

// adminApi.interceptors.request.use((config) => {
//   const adminData = JSON.parse(localStorage.getItem("adminData"));
//   if (token) {
//     config.headers.Authorization = `Bearer ${adminData?.accessToken}`;
//   }
//   return config;
// });

export default adminApi;
