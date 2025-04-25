import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { getAllDeposits, changeDepositStatus } from "../Services/adminDeposit";

export const AdminDeposit = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalImage, setModalImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDeposits = async () => {
    try {
      const data = await getAllDeposits();
      setDeposits(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await changeDepositStatus(id, newStatus);
      fetchDeposits();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const filteredDeposits = deposits.filter(
    (d) =>
      d.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminNavbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Deposits</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by username or status"
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading deposits...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredDeposits.length === 0 ? (
          <p>No matching deposits found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">User</th>
                  <th className="p-3">Coin</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">USD</th>
                  <th className="p-3">TX ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Screenshot</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeposits.map((d) => (
                  <tr key={d.id} className="border-t">
                    <td className="p-3">{d.userName}</td>
                    <td className="p-3">{d.coinType}</td>
                    <td className="p-3">{d.amount}</td>
                    <td className="p-3">{d.usdAmount}</td>
                    <td className="p-3">{d.txId}</td>
                    <td className="p-3">{d.status}</td>
                    <td className="p-3">{formatDate(d.createdAt)}</td>
                    <td className="p-3">
                      {d.screenshotData ? (
                        <img
                          src={`data:image/png;base64,${d.screenshotData}`}
                          alt="screenshot"
                          className="h-16 w-16 object-cover cursor-pointer hover:scale-110 transition-transform"
                          onClick={() =>
                            setModalImage(`data:image/png;base64,${d.screenshotData}`)
                          }
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-3 space-x-2">
                      {d.status === "Pending" && (
                        <>
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            onClick={() => handleStatusChange(d.id, "Approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => handleStatusChange(d.id, "Rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Screenshot Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Full screenshot"
            className="max-h-[90%] max-w-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </>
  );
};
