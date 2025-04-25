import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAdminAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("adminData"));

    if (adminData) {
      const currentTime = Date.now();
      const loginTime = adminData.loginTime;
      const hoursPassed = (currentTime - loginTime) / (1000 * 60 * 60);

      if (hoursPassed >= 24) {
        // Session expired
        localStorage.removeItem("adminData");
        alert("Session expired. Please login again.");
        navigate("/"); // Your Admin Login page route
      }
    } else {
      // Not logged in
      navigate("/");
    }
  }, [navigate]);
};

export default useAdminAuth;
