// File: src/pages/AdminUserPackages.jsx
import React, { useEffect, useState } from "react";
import { getAllUserPackages } from "@/api/adminPackages";
import { Card, CardContent } from "@/components/ui/card";

const AdminUserPackages = () => {
  const [userPackages, setUserPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPackages = async () => {
    setLoading(true);
    try {
      const data = await getAllUserPackages();
      setUserPackages(data);
    } catch (err) {
      console.error("Failed to fetch user packages:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserPackages();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Purchased Packages</h2>
      {loading ? (
        <p>Loading user packages...</p>
      ) : userPackages.length === 0 ? (
        <p>No user packages found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userPackages.map((item, idx) => (
            <Card key={idx}>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.userName}</h3>
                <p><strong>Package:</strong> {item.packageName}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Total Price:</strong> ${item.totalPrice}</p>
                <p><strong>Term:</strong> {item.contactTerm} Days</p>
                <p><strong>Daily Profit:</strong> {item.dailyProfit}%</p>
                <p><strong>TxID:</strong> {item.txId}</p>
                <p><strong>Created At:</strong> {new Date(item.createdAt).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUserPackages;
