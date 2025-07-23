import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;
  const maxPageButtons = 5; 

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/invoices/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchInvoices();
      else alert('Failed to delete invoice');
    } catch (err) {
      console.error('Error deleting invoice:', err);
      alert('Error deleting invoice');
    }
  };

  // Filter invoices by customer name
  const filteredInvoices = invoices.filter(inv =>
    inv.customer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  // Slice invoices for current page
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const goToPage = (page) => setCurrentPage(page);
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Function to get page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
      let endPage = startPage + maxPageButtons - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - maxPageButtons + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Invoices</h2>
        <Link
          to="/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Invoice
        </Link>
      </div>

      <input
        type="text"
        className="form-control mb-4 px-4 py-2 border border-gray-300 rounded w-full"
        placeholder="Search by customer name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {filteredInvoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-black text-white">
              <tr>
                <th className="py-2 px-4 border">Invoice No</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">First Item</th>
                <th className="py-2 px-4 border">Total Amount</th>
                <th className="py-2 px-4 border">Balance</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoices.map((inv) => (
                <tr key={inv._id} className="text-center">
                  <td className="py-2 px-4 border">{inv.invoiceNo}</td>
                  <td className="py-2 px-4 border">{inv.date}</td>
                  <td className="py-2 px-4 border">{inv.firstItem || 'N/A'}</td>
                  <td className="py-2 px-4 border">${inv.amount.toFixed(2)}</td>
                  <td className="py-2 px-4 border">{inv.balance != null ? `$${inv.balance.toFixed(2)}` : 'N/A'}</td>
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

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Prev
            </button>

            {/* First page and leading ellipsis */}
            {pageNumbers[0] > 1 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'bg-blue-700 text-white font-bold'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  1
                </button>
                {pageNumbers[0] > 2 && <span>...</span>}
              </>
            )}

            {/* Numbered page buttons */}
            {pageNumbers.map((num) => (
              <button
                key={num}
                onClick={() => goToPage(num)}
                className={`px-3 py-1 rounded ${
                  currentPage === num
                    ? 'bg-blue-700 text-white font-bold'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {num}
              </button>
            ))}

            {/* Last page and trailing ellipsis */}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span>...</span>}
                <button
                  onClick={() => goToPage(totalPages)}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-blue-700 text-white font-bold'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
