import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Invoice Manager</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Dashboard
          </Link>
          <Link to="/customers" className="text-blue-600 hover:text-blue-800">
            Customers
          </Link>
          <Link to="/items" className="text-blue-600 hover:text-blue-800">
            Items
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Hamburger button for mobile */}
        <button
          className="md:hidden text-blue-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 px-4">
          <Link to="/" className="block text-blue-600 hover:text-blue-800">
            Dashboard
          </Link>
          <Link
            to="/customers"
            className="block text-blue-600 hover:text-blue-800"
          >
            Customers
          </Link>
          <Link
            to="/items"
            className="block text-blue-600 hover:text-blue-800"
          >
            Items
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
