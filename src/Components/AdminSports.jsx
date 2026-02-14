import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import adminApi from "../Services/adminApi";

function AdminSports() {
  const [sports, setSports] = useState([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    fetchSports();
  }, []);

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

    adminApi.post("/api/admin/sports", { code, name }).then(() => {
      setCode("");
      setName("");
      fetchSports();
    });
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Create Sport Card */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Create Sport</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Sport Code
                </label>
                <input
                  type="text"
                  placeholder="e.g cricket"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Sport Name
                </label>
                <input
                  type="text"
                  placeholder="Cricket"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
              >
                Add Sport
              </button>
            </form>
          </div>

          {/* Sports Table */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">All Sports</h2>

            {!Array.isArray(sports) || sports.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                No sports available yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-gray-600 text-sm">
                      <th className="py-3 px-2">ID</th>
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Code</th>
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
                          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
                            {sport.code}
                          </span>
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
