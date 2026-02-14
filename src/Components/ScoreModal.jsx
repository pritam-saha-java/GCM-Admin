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
      await adminApi.put(
        `/api/admin/matches/${match.id}/score`,
        score
      );
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
        <h3 className="text-xl font-semibold">
          Update Score
        </h3>

        <input
          placeholder={`${match?.teamA?.name} Score`}
          className="w-full border p-2 rounded"
          value={score.teamAScore}
          onChange={(e) =>
            setScore({ ...score, teamAScore: e.target.value })
          }
        />

        <input
          placeholder="Overs"
          className="w-full border p-2 rounded"
          value={score.teamAOvers}
          onChange={(e) =>
            setScore({ ...score, teamAOvers: e.target.value })
          }
        />

        <input
          placeholder={`${match?.teamB?.name} Score`}
          className="w-full border p-2 rounded"
          value={score.teamBScore}
          onChange={(e) =>
            setScore({ ...score, teamBScore: e.target.value })
          }
        />

        <input
          placeholder="Overs"
          className="w-full border p-2 rounded"
          value={score.teamBOvers}
          onChange={(e) =>
            setScore({ ...score, teamBOvers: e.target.value })
          }
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
export default ScoreModal;
