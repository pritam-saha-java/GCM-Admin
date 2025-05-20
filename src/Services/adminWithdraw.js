const BASE_URL = import.meta.env.VITE_API_URL;
const ADMIN_TOKEN = JSON.parse(localStorage.getItem("adminData"))?.accessToken;

const config = {
  headers: {
    Authorization: `Bearer ${ADMIN_TOKEN}`,
  },
};

export const getAllWithdraws = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/withdraw/get-all`, config);
  if (!res.ok) throw new Error("Failed to fetch withdraws");
  return res.json();
};

export const changeWithdrawStatus = async (id, newStatus) => {
  const res = await fetch(`${BASE_URL}/api/admin/withdraw/change-status/${id}?status=${newStatus}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};
