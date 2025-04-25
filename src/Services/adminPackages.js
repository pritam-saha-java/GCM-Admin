// File: src/api/adminPackages.js
const BASE_URL = import.meta.env.VITE_BASE_URL;
const ADMIN_TOKEN = JSON.parse(localStorage.getItem("adminData"))?.accessToken;

const config = {
  headers: {
    Authorization: `Bearer ${ADMIN_TOKEN}`,
  },
};

export const getAllPackages = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/packages/all`, config);
  if (!res.ok) throw new Error("Failed to fetch packages");
  return res.json();
};

export const createPackage = async (formData) => {
  const res = await fetch(`${BASE_URL}/api/admin/packages/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to create package");
  return res.text();
};

export const updatePackage = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/api/admin/packages/update/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update package");
  return res.text();
};


export const deletePackage = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admin/packages/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  if (!res.ok) throw new Error("Failed to delete package");
  return res.text();
};
