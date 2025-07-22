import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');

  // Fetch all invoices from backend
  const fetchInvoices = () => {
    fetch('http://localhost:5000/api/invoices')
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(err => {
        console.error('Failed to fetch invoices:', err);
        setError('Failed to load invoices');
      });
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Delete invoice handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/invoices/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // Refresh invoice list after deletion
        fetchInvoices();
      } else {
        alert('Failed to delete invoice');
      }
    } catch (err) {
      console.error('Error deleting invoice:', err);
      alert('Error deleting invoice');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Invoices</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {invoices.length === 0 ? (
        <p>No invoices available.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Invoice No</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Customer</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv._id} className="text-center">
                <td className="py-2 px-4 border">{inv.invoiceNo}</td>
                <td className="py-2 px-4 border">{inv.date}</td>
                <td className="py-2 px-4 border">{inv.customer}</td>
                <td className="py-2 px-4 border">${inv.amount}</td>
                <td className="py-2 px-4 border space-x-2">
                  <Link to={`/invoice/${inv._id}`}>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                      View
                    </button>
                  </Link>
                  <Link to={`/edit/${inv._id}`}>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(inv._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
