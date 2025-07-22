import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => (
  <nav className="bg-white p-4 shadow-md flex justify-between items-center">
    <h1 className="text-xl font-bold text-blue-600">Invoice Manager</h1>
    <div className="space-x-4">
      <Link to="/" className="text-blue-600 hover:underline">
        Dashboard
      </Link>
      <Link
        to="/create"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-medium"
      >
        + Create Invoice
      </Link>
    </div>
  </nav>
);

export default Navigation;
