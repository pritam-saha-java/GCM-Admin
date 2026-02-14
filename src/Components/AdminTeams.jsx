import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import adminApi from "../Services/adminApi";

function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [sports, setSports] = useState([]);
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [sportId, setSportId] = useState("");

  useEffect(() => {
    fetchTeams();
    fetchSports();
  }, []);

  const fetchTeams = () => {
    adminApi.get("/api/admin/teams")
      .then((res) => {
        const data = res.data;

        if (Array.isArray(data)) {
          setTeams(data);
        } else if (Array.isArray(data?.data)) {
          setTeams(data.data);
        } else {
          setTeams([]);
        }
      })
      .catch(() => setTeams([]));
  };

  const fetchSports = () => {
    adminApi.get("/api/admin/sports")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setSports(data);
        } else if (Array.isArray(data?.data)) {
          setSports(data.data);
        } else {
          setSports([]);
        }
      })
      .catch(() => setSports([]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    adminApi.post("/api/admin/teams", {
      name,
      shortName,
      sportId,
    }).then(() => {
      setName("");
      setShortName("");
      setSportId("");
      fetchTeams();
    });
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Create Team Card */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Create Team</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Short Name
                </label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Sport
                </label>
                <select
                  value={sportId}
                  onChange={(e) => setSportId(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Select Sport</option>
                  {Array.isArray(sports) && sports.map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
              >
                Add Team
              </button>

            </form>
          </div>

          {/* Teams Table */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">All Teams</h2>

            {!Array.isArray(teams) || teams.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                No teams available yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-gray-600 text-sm">
                      <th className="py-3 px-2">ID</th>
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Short</th>
                      <th className="py-3 px-2">Sport</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team) => (
                      <tr
                        key={team.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-2">{team.id}</td>
                        <td className="py-3 px-2 font-medium">
                          {team.name}
                        </td>
                        <td className="py-3 px-2">
                          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
                            {team.shortName}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {team.sportName}
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
