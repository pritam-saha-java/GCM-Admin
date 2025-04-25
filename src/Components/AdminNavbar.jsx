import { Link, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Currency Management", path: "/currency-management" },
    { name: "Deposit", path: "/admin-deposit" },
    { name: "Withdraw", path: "/admin-withdraw" },
    { name: "Packages", path: "/admin-packages" },
  ];

  return (
    <nav className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">GoCloudMining Admin</h1>
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
      </div>
    </nav>
  );
};

export default AdminNavbar;
