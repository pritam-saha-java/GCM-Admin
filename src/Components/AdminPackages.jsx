import React, { useEffect, useState } from "react";
import {
  getAllPackages,
  deletePackage,
} from "../Services/adminPackages";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import CreateOrUpdatePackageModal from "../components/modals/CreateOrUpdatePackageModal";
import AdminNavbar from "../Components/AdminNavbar";

export const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await getAllPackages();
      setPackages(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await deletePackage(id);
      fetchPackages();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Manage Mining Packages
          </h2>
          <button
            onClick={() => {
              setEditingPackage(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Package
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading packages...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-5"
              >
                <img
                  src={`data:image/png;base64,${pkg.imageBase64}`}
                  alt={pkg.packageName}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {pkg.packageName}
                </h3>
                <div className="text-gray-600 text-sm space-y-1 mb-4">
                  <p>💰 <strong>Price:</strong> ${pkg.contactPrice}</p>
                  <p>📆 <strong>Term:</strong> {pkg.contactTerm} Days</p>
                  <p>📈 <strong>Daily Profit:</strong> {pkg.dailyProfit}%</p>
                  <p>📊 <strong>Total Profit:</strong> {pkg.totalProfit}%</p>
                  <p>👥 <strong>Level 1 Bonus:</strong> {pkg.level1Bonus}%</p>
                  <p>👥 <strong>Level 2 Bonus:</strong> {pkg.level2Bonus}%</p>
                  <p>👥 <strong>Level 3 Bonus:</strong> {pkg.level3Bonus}%</p>
                </div>

                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingPackage(pkg);
                      setModalOpen(true);
                    }}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                    title="Edit Package"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-full"
                    title="Delete Package"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <CreateOrUpdatePackageModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSuccess={() => {
              fetchPackages();
              setModalOpen(false);
            }}
            editingPackage={editingPackage}
          />
        )}
      </div>
    </>
  );
};
