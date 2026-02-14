import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import adminApi from "../Services/adminApi";

function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [sports, setSports] = useState([]);
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [sportId, setSportId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeams();
    fetchSports();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await adminApi.get("/api/admin/teams");
      setTeams(res.data || []);
    } catch {
      setTeams([]);
    }
  };

  const fetchSports = async () => {
    try {
      const res = await adminApi.get("/api/admin/sports");
      setSports(res.data || []);
    } catch {
      setSports([]);
    }
  };

  const resetForm = () => {
    setName("");
    setShortName("");
    setSportId("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !sportId) {
      setError("Name and Sport are required");
      return;
    }

    try {
      setError("");

      if (editingId) {
        await adminApi.put(`/api/admin/teams/${editingId}`, {
          name,
          shortName,
          sportId,
        });
      } else {
        await adminApi.post("/api/admin/teams", {
          name,
          shortName,
          sportId,
        });
      }

      resetForm();
      fetchTeams();
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  const handleEdit = (team) => {
    setEditingId(team.id);
    setName(team.name);
    setShortName(team.shortName || "");
    setSportId(team.sportId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this team?")) return;

    try {
      await adminApi.delete(`/api/admin/teams/${id}`);
      fetchTeams();
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* FORM */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Update Team" : "Create Team"}
            </h2>

            {error && (
              <div className="mb-4 text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Team Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-xl px-4 py-2"
              />

              <input
                type="text"
                placeholder="Short Name"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                className="w-full border rounded-xl px-4 py-2"
              />

              <select
                value={sportId}
                onChange={(e) => setSportId(e.target.value)}
                className="w-full border rounded-xl px-4 py-2 bg-white"
              >
                <option value="">Select Sport</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-xl"
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

          {/* TABLE */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">All Teams</h2>

            {teams.length === 0 ? (
              <div className="text-gray-400 py-6">
                No teams available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-gray-600 text-sm">
                      <th>ID</th>
                      <th>Name</th>
                      <th>Short</th>
                      <th>Sport</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {teams.map((team) => (
                      <tr key={team.id} className="border-b">
                        <td>{team.id}</td>
                        <td>{team.name}</td>
                        <td>{team.shortName}</td>
                        <td>{team.sportName}</td>
                        <td className="space-x-3">
                          <button
                            onClick={() => handleEdit(team)}
                            className="text-blue-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(team.id)}
                            className="text-red-600 text-sm"
                          >
                            Delete
                          </button>
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

export default AdminTeams;
