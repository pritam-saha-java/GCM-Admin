import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import adminApi from "../Services/adminApi";

function AdminSports() {
  const [sports, setSports] = useState([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/api/admin/sports");
      setSports(res.data || []);
    } catch (err) {
      setError("Failed to load sports");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCode("");
    setName("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim() || !name.trim()) {
      setError("Code and Name are required");
      return;
    }

    try {
      setError("");

      if (editingId) {
        await adminApi.put(`/api/admin/sports/${editingId}`, {
          code,
          name,
        });
      } else {
        await adminApi.post("/api/admin/sports", {
          code,
          name,
        });
      }

      resetForm();
      fetchSports();
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  const handleEdit = (sport) => {
    setEditingId(sport.id);
    setCode(sport.code);
    setName(sport.name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sport?")) return;

    try {
      await adminApi.delete(`/api/admin/sports/${id}`);
      fetchSports();
    } catch {
      setError("Delete failed");
    }
  };

  const handleRestore = async (id) => {
    try {
      await adminApi.put(`/api/admin/sports/${id}/restore`);
      fetchSports();
    } catch {
      setError("Restore failed");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* FORM CARD */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Update Sport" : "Create Sport"}
            </h2>

            {error && (
              <div className="mb-4 text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm mb-1">Sport Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g cricket"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Sport Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Cricket"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
                >
                  {editingId ? "Update" : "Add"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* TABLE CARD */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">All Sports</h2>

            {loading ? (
              <div className="text-gray-400 py-6">Loading...</div>
            ) : sports.length === 0 ? (
              <div className="text-gray-400 py-6">
                No sports available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-gray-600 text-sm">
                      <th className="py-3 px-2">ID</th>
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Code</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sports.map((sport) => (
                      <tr
                        key={sport.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-2">{sport.id}</td>
                        <td className="py-3 px-2 font-medium">
                          {sport.name}
                        </td>
                        <td className="py-3 px-2">
                          <span className="bg-gray-200 px-3 py-1 rounded-full text-xs">
                            {sport.code}
                          </span>
                        </td>

                        <td className="py-3 px-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              sport.active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {sport.active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="py-3 px-2 space-x-3">

                          <button
                            onClick={() => handleEdit(sport)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Edit
                          </button>

                          {sport.active ? (
                            <button
                              onClick={() => handleDelete(sport.id)}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Delete
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestore(sport.id)}
                              className="text-green-600 hover:underline text-sm"
                            >
                              Restore
                            </button>
                          )}

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default AdminSports;
