import React from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import AdminNavbar from "./AdminNavbar";

export const AdminEvents = () => {
  const mockData = [1, 2];

  return (
    <>
      <AdminNavbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Manage Events
          </h2>
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Event
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockData.map((item) => (
            <div
              key={item}
              className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-5"
            >
              <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">Event Banner</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                Event {item}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Event details or description goes here.
              </p>

              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-full"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
