const MatchModal = ({
  formData,
  setFormData,
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
export default MatchModal;