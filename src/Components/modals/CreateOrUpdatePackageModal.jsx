import React, { useState, useEffect } from "react";
import { createPackage, updatePackage } from "../../Services/adminPackages";

const CreateOrUpdatePackageModal = ({ open, onClose, onSuccess, editingPackage }) => {
  const [formData, setFormData] = useState({
    packageName: "",
    contactPrice: "",
    contactTerm: "",
    dailyProfit: "",
    totalProfit: "",
    level1Bonus: "",
    level2Bonus: "",
    level3Bonus: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPackage) {
      setFormData({
        packageName: editingPackage.packageName,
        contactPrice: editingPackage.contactPrice,
        contactTerm: editingPackage.contactTerm,
        dailyProfit: editingPackage.dailyProfit,
        totalProfit: editingPackage.totalProfit,
        level1Bonus: editingPackage.level1Bonus,
        level2Bonus: editingPackage.level2Bonus,
        level3Bonus: editingPackage.level3Bonus,
      });
    }
  }, [editingPackage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
  
      // Append each field individually
      for (const key in formData) {
        form.append(key, formData[key]);
      }
  
      if (image) form.append("image", image);
  
      if (editingPackage) {
        await updatePackage(editingPackage.id, form);
      } else {
        await createPackage(form);
      }
  
      onSuccess();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  
  

  if (!open) return null;  // Hide the modal if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          {editingPackage ? "Update Package" : "Create Package"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formData).map(([key, val]) => (
              <div key={key} className="flex flex-col space-y-2">
                <label className="block text-sm font-medium text-gray-700">{key.replace(/([A-Z])/g, " $1").trim()}</label>
                <input
                  type="text"
                  name={key}
                  placeholder={key.replace(/([A-Z])/g, " $1").trim()}
                  value={val}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-700">Package Image</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-300 text-lg"
            >
              {loading ? "Saving..." : editingPackage ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-6 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition text-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrUpdatePackageModal;
