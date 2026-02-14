import React, { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, CheckCircle } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import adminApi from "../Services/adminApi";

/* ================= DEFAULT FORM ================= */

const DEFAULT_FORM = {
  sportId: "",
  league: "",
  venue: "",
  teamAId: "",
  teamBId: "",
  status: "LIVE",
  timeInfo: "",
  youtubeLink: "",
};

/* ========================================================= */
/* ======================= COMPONENT ======================= */
/* ========================================================= */

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMatch, setEditMatch] = useState(null);
  const [scoreModal, setScoreModal] = useState(null);

  const [formData, setFormData] = useState(DEFAULT_FORM);

  /* ================= FETCH SPORTS ================= */

  const fetchSports = async () => {
    try {
      const res = await adminApi.get("/api/admin/sports");
      setSports(res?.data || []);
    } catch (err) {
      console.error("Failed to load sports", err);
    }
  };

  /* ================= FETCH TEAMS ================= */

  const fetchTeams = async (sportId) => {
    if (!sportId) return;
    try {
      const res = await adminApi.get(`/api/admin/teams/by-sport/${sportId}`);
      setTeams(res?.data || []);
    } catch (err) {
      console.error("Failed to load teams", err);
    }
  };

  /* ================= FETCH MATCHES ================= */

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/api/admin/matches");
      setMatches(res?.data?.data?.content || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
    fetchMatches();
  }, []);

  /* ================= OPEN CREATE ================= */

  const openCreate = () => {
    setEditMatch(null);
    setFormData(DEFAULT_FORM);
    setTeams([]);
    setModalOpen(true);
  };

  /* ================= OPEN EDIT ================= */

  const openEdit = async (match) => {
    setEditMatch(match);

    await fetchTeams(match.sportId);

    setFormData({
      sportId: match.sportId || "",
      league: match.league || "",
      venue: match.venue || "",
      teamAId: match.teamAId || "",
      teamBId: match.teamBId || "",
      status: match.status || "LIVE",
      timeInfo: match.time || "",
      youtubeLink: match.youtubeLink || "",
    });

    setModalOpen(true);
  };

  /* ================= SUBMIT ================= */

  const submitMatch = async (e) => {
    e.preventDefault();

    if (!formData.sportId) return alert("Sport required");
    if (!formData.teamAId || !formData.teamBId)
      return alert("Both teams required");
    if (formData.teamAId === formData.teamBId)
      return alert("Team A and Team B cannot be same");

    try {
      const payload = {
        ...formData,
        sportId: Number(formData.sportId),
        teamAId: Number(formData.teamAId),
        teamBId: Number(formData.teamBId),
      };

      if (editMatch) {
        await adminApi.put(`/api/admin/matches/${editMatch.id}`, payload);
      } else {
        await adminApi.post("/api/admin/matches", payload);
      }

      setModalOpen(false);
      fetchMatches();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save match");
    }
  };

  /* ================= DELETE ================= */

  const deleteMatch = async (id) => {
    if (!window.confirm("Delete match permanently?")) return;
    try {
      await adminApi.delete(`/api/admin/matches/${id}`);
      fetchMatches();
    } catch {
      alert("Delete failed");
    }
  };

  /* ================= COMPLETE ================= */

  const completeMatch = async (id) => {
    try {
      await adminApi.put(`/api/admin/matches/${id}/status`, null, {
        params: { status: "COMPLETED" },
      });
      fetchMatches();
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-semibold">Manage Matches</h2>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg"
          >
            <PlusCircle size={20} /> Add Match
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.isArray(matches) && matches.length > 0 ? (
              matches.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-xl border shadow p-5"
                >
                  <h3 className="font-bold">{m.league}</h3>
                  <p className="text-gray-500">{m.venue}</p>

                  <div className="mt-3 text-sm">
                    <div className="flex justify-between">
                      <span>{m.teamA?.name}</span>
                      <strong>{m.teamA?.score || "-"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>{m.teamB?.name}</span>
                      <strong>{m.teamB?.score || "-"}</strong>
                    </div>
                  </div>

                  {/* YouTube Button */}
                  {m.youtubeLink && m.status === "LIVE" && (
                    <a
                      href={m.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      🔴 Watch Live
                    </a>
                  )}

                  <div className="mt-4 flex justify-between">
                    <span className="text-xs px-3 py-1 rounded bg-gray-100">
                      {m.status}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(m)}
                        className="p-2 bg-yellow-100 rounded"
                      >
                        <Pencil size={16} />
                      </button>

                      {m.status === "LIVE" && (
                        <button
                          onClick={() => completeMatch(m.id)}
                          className="p-2 bg-green-100 rounded"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => deleteMatch(m.id)}
                        className="p-2 bg-red-100 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No matches available</p>
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <MatchModal
          formData={formData}
          setFormData={setFormData}
          sports={sports}
          teams={teams}
          fetchTeams={fetchTeams}
          onClose={() => setModalOpen(false)}
          onSubmit={submitMatch}
          editMatch={editMatch}
        />
      )}

      {scoreModal && (
        <ScoreModal
          match={scoreModal}
          onClose={() => setScoreModal(null)}
          onSaved={fetchMatches}
        />
      )}
    </>
  );
};

export default AdminMatches;

/* ========================================================= */
/* ======================= MATCH MODAL ===================== */
/* ========================================================= */

const MatchModal = ({
  formData,
  setFormData,
  sports,
  teams,
  fetchTeams,
  onClose,
  onSubmit,
  editMatch,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4"
      >
        <h3 className="text-2xl font-semibold">
          {editMatch ? "Edit Match" : "Add Match"}
        </h3>

        <select
          className="w-full border p-2 rounded"
          value={formData.sportId}
          onChange={(e) => {
            setFormData({
              ...formData,
              sportId: e.target.value,
              teamAId: "",
              teamBId: "",
            });
            fetchTeams(e.target.value);
          }}
          required
        >
          <option value="">Select Sport</option>
          {sports.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className="w-full border p-2 rounded"
          value={formData.teamAId}
          onChange={(e) =>
            setFormData({ ...formData, teamAId: e.target.value })
          }
          required
        >
          <option value="">Select Team A</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          className="w-full border p-2 rounded"
          value={formData.teamBId}
          onChange={(e) =>
            setFormData({ ...formData, teamBId: e.target.value })
          }
          required
        >
          <option value="">Select Team B</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          placeholder="League"
          className="w-full border p-2 rounded"
          value={formData.league}
          onChange={(e) =>
            setFormData({ ...formData, league: e.target.value })
          }
          required
        />

        <input
          placeholder="Venue"
          className="w-full border p-2 rounded"
          value={formData.venue}
          onChange={(e) =>
            setFormData({ ...formData, venue: e.target.value })
          }
          required
        />

        <input
          placeholder="Time Info"
          className="w-full border p-2 rounded"
          value={formData.timeInfo}
          onChange={(e) =>
            setFormData({ ...formData, timeInfo: e.target.value })
          }
        />

        <input
          placeholder="YouTube Live / Highlights Link"
          className="w-full border p-2 rounded"
          value={formData.youtubeLink}
          onChange={(e) =>
            setFormData({ ...formData, youtubeLink: e.target.value })
          }
        />

        <select
          className="w-full border p-2 rounded"
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
        >
          <option value="LIVE">LIVE</option>
          <option value="UPCOMING">UPCOMING</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            {editMatch ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ========================================================= */
/* ======================= SCORE MODAL ===================== */
/* ========================================================= */

const ScoreModal = ({ match, onClose, onSaved }) => {
  const [score, setScore] = useState({
    teamAScore: match?.teamA?.score || "",
    teamAOvers: match?.teamA?.overs || "",
    teamBScore: match?.teamB?.score || "",
    teamBOvers: match?.teamB?.overs || "",
  });

  const submit = async (e) => {
    e.preventDefault();

    if (!score.teamAScore || !score.teamBScore) {
      alert("Both team scores are required");
      return;
    }

    try {
      await adminApi.put(`/api/admin/matches/${match.id}/score`, score);
      onSaved();
      onClose();
    } catch {
      alert("Score update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-lg w-full max-w-md space-y-4"
      >
        <h3 className="text-xl font-semibold">Update Score</h3>

        <input
          placeholder={`${match?.teamA?.name} Score`}
          className="w-full border p-2 rounded"
          value={score.teamAScore}
          onChange={(e) => setScore({ ...score, teamAScore: e.target.value })}
        />

        <input
          placeholder="Overs"
          className="w-full border p-2 rounded"
          value={score.teamAOvers}
          onChange={(e) => setScore({ ...score, teamAOvers: e.target.value })}
        />

        <input
          placeholder={`${match?.teamB?.name} Score`}
          className="w-full border p-2 rounded"
          value={score.teamBScore}
          onChange={(e) => setScore({ ...score, teamBScore: e.target.value })}
        />

        <input
          placeholder="Overs"
          className="w-full border p-2 rounded"
          value={score.teamBOvers}
          onChange={(e) => setScore({ ...score, teamBOvers: e.target.value })}
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};
