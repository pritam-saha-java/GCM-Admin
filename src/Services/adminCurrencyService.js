import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const adminData = JSON.parse(localStorage.getItem("adminData"));
  return {
    headers: {
      Authorization: `Bearer ${adminData?.accessToken}`,
    },
  };
};

export const getAllCoins = async () => {
  return axios.get(`${BASE_URL}/api/admin/coins/get-all`, getAuthHeader());
};

export const getCoin = async (id) => {
  return axios.get(`${BASE_URL}/api/admin/coins/get/${id}`, getAuthHeader());
};

export const addCoin = async (coinData) => {
  return axios.post(`${BASE_URL}/api/admin/coins/add`, coinData, getAuthHeader());
};

export const updateCoin = async (id, coinData) => {
  return axios.put(`${BASE_URL}/api/admin/coins/update/${id}`, coinData, getAuthHeader());
};

export const deleteCoin = async (id) => {
  return axios.delete(`${BASE_URL}/api/admin/coins/delete/${id}`, getAuthHeader());
};
