import React, { useState } from "react";
import { Menu, X, Code } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Problems", path: "/problems" },
    { name: "IDE", path: "/ide" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Discuss", path: "/discuss" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-indigo-400" />
            <span className="text-xl font-bold">CodeArena</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-indigo-400 transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Login/Profile Button */}
          <div className="hidden md:flex">
            <Link
              to="/login"
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md transition"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-gray-300 hover:text-indigo-400"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/login"
            className="block px-4 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 rounded-md transition"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
