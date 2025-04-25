import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Currency Management", path: "/currency" },
    { name: "Deposit", path: "/admin-deposit" },
    { name: "Withdraw", path: "/admin-withdraw" },
    { name: "Packages", path: "/admin-packages" },
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("adminData"));
    if (!storedUser || !storedUser.accessToken || !storedUser.roles?.includes("ROLE_ADMIN")) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminData"); // Clear local storage
    navigate("/"); // Redirect to login
  };

  return (
    <nav className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">GoCloudMining Admin</h1>
        <div className="flex items-center space-x-6">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`hover:text-yellow-400 transition duration-300 ${
                    location.pathname === link.path ? "text-yellow-400 font-semibold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-full text-white font-semibold transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
