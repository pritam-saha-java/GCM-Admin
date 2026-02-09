import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import toast from "react-hot-toast";

export const AdminManagement = () => {
  const [managements, setManagements] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    managementName: "",
    designation: "",
    projectId: "",
    managementImage: null,
  });

  // 🌐 Base URL from env
  const API_BASE = import.meta.env.VITE_API_URL + "/api/managements";

  useEffect(() => {
    fetchManagements();
  }, []);

  const fetchManagements = async () => {
    try {
      const res = await axios.get(API_BASE);
      setManagements(res.data);
    } catch (err) {
      toast.error("Failed to fetch managements");
    }
  };

  const handleOpenModal = (management = null) => {
    if (management) {
      setEditId(management.id);
      setFormData({
        managementName: management.managementName,
        designation: management.designation || "",
        projectId: management.projectId,
        managementImage: null,
      });
    } else {
      setEditId(null);
      setFormData({
        managementName: "",
        designation: "",
        projectId: "",
        managementImage: null,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "managementImage") {
      setFormData({ ...formData, managementImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("managementName", formData.managementName);
    data.append("designation", formData.designation);
    data.append("projectId", formData.projectId);
    if (formData.managementImage) {
      data.append("managementImage", formData.managementImage);
    }

    try {
      if (editId) {
        await axios.put(`${API_BASE}/${editId}`, data);
        toast.success("Management updated successfully");
      } else {
        await axios.post(API_BASE, data);
        toast.success("Management created successfully");
      }
      fetchManagements();
      handleCloseModal();
    } catch (err) {
      toast.error("Failed to save management");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this management?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      toast.success("Management deleted");
      fetchManagements();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Manage Management
          </h2>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Add New
          </button>
        </div>

        {managements.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">No managements found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {managements.map((m) => (
              <div
                key={m.id}
                className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-5"
              >
                <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {m.managementImage ? (
                    <img
                      src={`${API_BASE}/${m.id}/image`}
                      alt={m.managementName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {m.managementName}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  {m.designation || "—"}
                </p>
                <p className="text-sm text-gray-500">
                  Project ID: {m.projectId}
                </p>

                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => handleOpenModal(m)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-full"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-semibold mb-4">
              {editId ? "Edit Management" : "Add Management"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Management Name</label>
                <input
                  type="text"
                  name="managementName"
                  value={formData.managementName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Project ID</label>
                <input
                  type="number"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload Image</label>
                <input
                  type="file"
                  name="managementImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-sm text-gray-600"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  {editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
