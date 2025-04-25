import { useEffect, useState } from "react";
import {
  getAllCoins,
  addCoin,
  updateCoin,
  deleteCoin,
} from "../Services/adminCurrencyService";
import AdminNavbar from "../Components/AdminNavbar";

const CurrencyManagement = () => {
  const [coins, setCoins] = useState([]);
  const [formData, setFormData] = useState({
    coinName: "",
    conversionRate: "",
    adminWalletAddress: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCoins = async () => {
    try {
      const res = await getAllCoins();
      setCoins(res.data);
    } catch (err) {
      console.error("Error fetching coins:", err);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateCoin(editId, formData);
      } else {
        await addCoin(formData);
      }
      setFormData({ coinName: "", conversionRate: "", adminWalletAddress: "" });
      setEditMode(false);
      fetchCoins();
    } catch (err) {
      console.error("Error saving coin:", err);
    }
  };

  const handleEdit = (coin) => {
    setFormData(coin);
    setEditId(coin.id);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCoin(id);
      fetchCoins();
    } catch (err) {
      console.error("Error deleting coin:", err);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Currency Management</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
          <input
            type="text"
            name="coinName"
            placeholder="Coin Name"
            value={formData.coinName}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="conversionRate"
            placeholder="Conversion Rate (Per USD)"
            value={formData.conversionRate}
            onChange={handleChange}
            className="p-2 border rounded"
            step="0.01"
            required
          />
          <input
            type="text"
            name="adminWalletAddress"
            placeholder="Admin Wallet Address"
            value={formData.adminWalletAddress}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            {editMode ? "Update Coin" : "Add Coin"}
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Existing Coins</h3>
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Coin Name</th>
                <th className="p-2 border">Conversion Rate</th>
                <th className="p-2 border">Wallet Address</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, idx) => (
                <tr key={coin.id} className="border-t">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{coin.coinName}</td>
                  <td className="p-2 border">${coin.conversionRate}</td>
                  <td className="p-2 border">{coin.adminWalletAddress}</td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => handleEdit(coin)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coin.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {coins.length === 0 && (
                <tr>
                  <td className="p-2 text-center" colSpan={5}>
                    No currencies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CurrencyManagement;
