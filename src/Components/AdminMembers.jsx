import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";
import AdminNavbar from "./AdminNavbar";

const API_URL = import.meta.env.VITE_API_URL;

export const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [formData, setFormData] = useState({
    memberName: "",
    company: "",
    designation: "",
    projectId: "",
    imageFile: null,
    preview: null,
  });

  // 📌 Fetch Members
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/members`);
      setMembers(res.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 📌 Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      imageFile: file,
      preview: file ? URL.createObjectURL(file) : null,
    });
  };

  // 📌 Open Modal for Add or Edit
  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        memberName: member.memberName,
        company: member.company || "",
        designation: member.designation || "",
        projectId: member.projectId || "",
        imageFile: null,
        preview: member.id
          ? `${API_URL}/api/members/${member.id}/image`
          : null,
      });
    } else {
      setEditingMember(null);
      setFormData({
        memberName: "",
        company: "",
        designation: "",
        projectId: "",
        imageFile: null,
        preview: null,
      });
    }
    setModalOpen(true);
  };

  // 📌 Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingMember(null);
  };

  // 📌 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("memberName", formData.memberName);
    form.append("projectId", formData.projectId);
    form.append("company", formData.company);
    form.append("designation", formData.designation);
    if (formData.imageFile) form.append("memberImage", formData.imageFile);

    try {
      if (editingMember) {
        await axios.put(
          `${API_URL}/api/members/${editingMember.id}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(`${API_URL}/api/members`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchMembers();
      closeModal();
    } catch (error) {
      console.error("Error saving member:", error);
    }
  };

  // 📌 Delete Member
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this member?")) {
      try {
        await axios.delete(`${API_URL}/api/members/${id}`);
        fetchMembers();
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Manage Members
          </h2>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Add New
          </button>
        </div>

        {members.length === 0 ? (
          <p className="text-gray-500">No members found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-5"
              >
                <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {member.id ? (
                    <img
                      src={`${API_URL}/api/members/${member.id}/image`}
                      alt="Member"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {member.memberName}
                </h3>
                <p className="text-gray-600 text-sm">{member.company}</p>
                <p className="text-gray-600 text-sm mb-4">{member.designation}</p>

                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => openModal(member)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-semibold mb-4">
              {editingMember ? "Edit Member" : "Add Member"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Member Name"
                value={formData.memberName}
                onChange={(e) =>
                  setFormData({ ...formData, memberName: e.target.value })
                }
                className="w-full border rounded-lg p-2"
                required
              />

              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />

              <input
                type="text"
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />

              <input
                type="number"
                placeholder="Project ID"
                value={formData.projectId}
                onChange={(e) =>
                  setFormData({ ...formData, projectId: e.target.value })
                }
                className="w-full border rounded-lg p-2"
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-lg p-2"
              />

              {formData.preview && (
                <div className="mt-2 h-32 rounded overflow-hidden">
                  <img
                    src={formData.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingMember ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
