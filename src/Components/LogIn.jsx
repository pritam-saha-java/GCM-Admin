import { useState } from "react";
import "../Styles/MyApp.css";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../Services/UserService";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await adminLogin(formData);
      const adminDataWithTimestamp = {
        ...response,
        loginTime: Date.now(),
      };

      localStorage.setItem("adminData", JSON.stringify(adminDataWithTimestamp));
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/currency"), 1000);
    } catch (err) {
      const msg = err.response?.data || "Login failed!";
      setError(msg);
    }
  };

  return (
    <section className="h-[100vh] w-full bg-gradient-to-br from-black via-gray-900 to-blue-900 flex justify-center items-center">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-10 shadow-2xl w-[90%] max-w-[480px]">
        <h2 className="text-3xl font-bold text-white text-center mb-3">
          GoCloudMining Admin
        </h2>
        <p className="text-center text-blue-200 mb-6 text-sm tracking-wide">
          Please enter your admin credentials
        </p>

        {error && <div className="text-red-400 text-sm mb-3 text-center">{error}</div>}
        {success && <div className="text-green-400 text-sm mb-3 text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Admin Username"
            required
            className="w-full px-4 py-3 bg-white/10 border border-blue-400 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-3 bg-white/10 border border-blue-400 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-blue-300 hover:text-white"
            >
              {showPassword ? (
                <i className="fa-solid fa-eye-slash"></i>
              ) : (
                <i className="fa-solid fa-eye"></i>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold tracking-wide transition"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
