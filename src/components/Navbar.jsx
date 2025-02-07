import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { path: "/", name: "Dashboard" },
    { path: "/additem", name: "Add Item" },
    { path: "/sales", name: "SALES" },
    { path: "/stock", name: "STOCK" },
    { path: "/report", name: "REPORT" },
    { path: "/login", name: "Login" },
  ];

  const handleLogOut = () => {
    logOut()
      .then()
      .catch((error) => console.log(error));
  };

  return (
    <nav className="bg-gradient-to-r from-[#2973B2] via-[#3498db] to-[#5DADE2] shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4 relative">
        {/* Logo */}
        <h1 className="text-white text-3xl font-extrabold tracking-wider drop-shadow-md">
          Easy<span className="text-[#FFD700]">Inventory</span>
        </h1>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white text-3xl hover:text-[#FFD700] transition duration-300"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation links */}
        <ul
          className={`md:flex md:items-center md:gap-8 absolute md:static top-16 left-0 w-full md:w-auto 
          transition-all duration-500 ease-in-out ${
            isOpen
              ? "block bg-gradient-to-r from-[#2973B2] via-[#3498db] to-[#5DADE2]"
              : "hidden"
          } md:bg-transparent`}
        >
          {navLinks.map((link, index) => (
            <li key={index} className="border-b border-gray-200 md:border-none">
              <Link
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-lg font-medium px-6 py-3 md:px-0 md:py-0 transition-all duration-300 ${
                  location.pathname === link.path
                    ? "text-[#FFD700] border-b-2 border-[#FFD700] md:border-none"
                    : "text-white hover:text-[#FFD700] hover:scale-105"
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

export default Navbar;
