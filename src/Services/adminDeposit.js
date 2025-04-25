const API_BASE = import.meta.env.VITE_BASE_URL + '/api/admin/deposits';
const adminData = JSON.parse(localStorage.getItem("adminData"));
const headers = {
  Authorization: `${adminData?.tokenType} ${adminData?.accessToken}`,
};

export const getAllDeposits = async () => {
  const res = await fetch(`${API_BASE}/get-all`, { headers });
  if (!res.ok) throw new Error("Failed to fetch deposits");
  return res.json();
};

export const changeDepositStatus = async (id, status) => {
  const res = await fetch(`${API_BASE}/change-status/${id}?status=${status}`, {
    method: "PUT",
    headers,
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};
