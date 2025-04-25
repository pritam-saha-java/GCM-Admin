import React, { useEffect, useState } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import { getAllWithdraws, changeWithdrawStatus } from "../Services/adminWithdraw";
import { getAllCoins } from "../Services/adminCurrencyService";
import { format } from "date-fns";

export const AdminWithdraw = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [filteredWithdraws, setFilteredWithdraws] = useState([]);
  const [coins, setCoins] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal control
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null); // { id, newStatus }

  const fetchWithdraws = async () => {
    try {
      setLoading(true);
      const data = await getAllWithdraws();
      setWithdraws(data);
      setFilteredWithdraws(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoins = async () => {
    try {
      const coinData = await getAllCoins();
      const coinMap = {};
      coinData.forEach((coin) => {
        coinMap[coin.id] = coin.coinName;
      });
      setCoins(coinMap);
    } catch (err) {
      console.error("Error loading coins", err);
    }
  };
  

  const confirmStatusChange = (id, status) => {
    setSelectedAction({ id, status });
    setShowModal(true);
  };

  const handleStatusChange = async () => {
    if (!selectedAction) return;
    try {
      await changeWithdrawStatus(selectedAction.id, selectedAction.status);
      setShowModal(false);
      fetchWithdraws();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const filtered = withdraws.filter(
      (w) =>
        w.userName.toLowerCase().includes(keyword) ||
        w.status.toLowerCase().includes(keyword)
    );
    setFilteredWithdraws(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600 font-semibold";
      case "Rejected":
        return "text-red-500 font-semibold";
      case "Pending":
      default:
        return "text-yellow-600 font-semibold";
    }
  };

  useEffect(() => {
    fetchWithdraws();
    fetchCoins();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="mt-6 bg-white rounded-lg shadow-md p-4 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Withdrawal Requests</h2>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by username or status"
            className="border px-3 py-1 rounded-md w-72"
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredWithdraws.length === 0 ? (
          <p>No withdrawals found.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">User</th>
                <th className="p-2">USD</th>
                <th className="p-2">Receivable</th>
                <th className="p-2">Coin</th>
                <th className="p-2">Status</th>
                <th className="p-2">Tx ID</th>
                <th className="p-2">Date</th>
                <th className="p-2">Change Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdraws.map((w, i) => (
                <tr key={w.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{w.userName}</td>
                  <td className="p-2">${w.amountInUsd?.toFixed(2)}</td>
                  <td className="p-2">{w.receivable?.toFixed(6)}</td>
                  <td className="p-2">{coins[w.selectedCurrency] || `ID: ${w.selectedCurrency}`}</td>
                  <td className={`p-2 ${getStatusColor(w.status)}`}>{w.status}</td>
                  <td className="p-2">{w.txId}</td>
                  <td className="p-2">
                    {w.createdAt
                      ? format(new Date(w.createdAt), "dd MMM yyyy, hh:mm a")
                      : "-"}
                  </td>
                  <td className="p-2">
                    <select
                      value={w.status}
                      onChange={(e) => confirmStatusChange(w.id, e.target.value)}
                      disabled={w.status !== "Pending"}
                      className={`px-2 py-1 border rounded bg-white ${
                        w.status !== "Pending" ? "text-gray-400" : ""
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
            <p className="mb-4">
              Are you sure you want to{" "}
              <span className="font-bold text-blue-700">{selectedAction.status}</span> this withdrawal?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
