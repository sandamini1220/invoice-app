import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getInvoices, deleteInvoice } from '../api/invoiceAPI';

const Dashboard = ({ user }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();
  const invoicesPerPage = 5;
  const maxPageButtons = 5;

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getInvoices();
      
      // Handle both response.data and direct response based on your API structure
      const invoiceData = response.data || response;
      setInvoices(Array.isArray(invoiceData) ? invoiceData : []);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
      
              // Better error handling based on error type
      if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
        // Redirect to login if token is invalid
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view invoices.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.response?.data?.message || 'Failed to load invoices');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id, invoiceNo) => {
    const confirmMessage = invoiceNo 
      ? `Are you sure you want to delete invoice ${invoiceNo}?`
      : 'Are you sure you want to delete this invoice?';
      
    if (!window.confirm(confirmMessage)) return;
    
    try {
      setDeleteLoading(id);
      await deleteInvoice(id);
      
      // Remove the deleted invoice from state immediately
      setInvoices(prevInvoices => prevInvoices.filter(inv => inv._id !== id));
      
      // Adjust current page if necessary
      const remainingInvoices = invoices.filter(inv => inv._id !== id);
      const filteredRemaining = remainingInvoices.filter(inv =>
        inv.customer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const newTotalPages = Math.ceil(filteredRemaining.length / invoicesPerPage);
      
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
    } catch (err) {
      console.error('Error deleting invoice:', err);
      
      let errorMessage = 'Error deleting invoice';
      if (err.response?.status === 404) {
        errorMessage = 'Invoice not found. It may have already been deleted.';
        // Refresh the list in case it was deleted elsewhere
        fetchInvoices();
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      alert(errorMessage);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter invoices based on search term (checking customer field)
  const filteredInvoices = invoices.filter(inv =>
    inv.customer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
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

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
      let endPage = startPage + maxPageButtons - 1;
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - maxPageButtons + 1;
      }
      for (let i = startPage; i <= endPage; i++) pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Format currency
  const formatCurrency = (amount) => {
    if (amount == null) return 'N/A';
    return `$${Number(amount).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading invoices...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Invoice Dashboard</h2>
          {user && <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>}
        </div>
        <Link
          to="/create"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          + Add New Invoice
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search by customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
          <button
            onClick={fetchInvoices}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Results Summary */}
      {!error && (
        <div className="mb-4 text-gray-600">
          {searchTerm ? (
            <p>
              Found {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} 
              {filteredInvoices.length > 0 && ` for "${searchTerm}"`}
            </p>
          ) : (
            <p>Total: {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      )}

      {/* Invoice Table */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {searchTerm ? `No invoices found for "${searchTerm}"` : 'No invoices found'}
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Invoice No</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">First Item</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentInvoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-blue-600">
                      {inv.invoiceNo || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(inv.date)}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {inv.customer || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {inv.firstItem || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${
                        inv.balance > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(inv.balance)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <Link to={`/invoice/${inv._id}`}>
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">
                            View
                          </button>
                        </Link>
                        <Link to={`/edit/${inv._id}`}>
                          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(inv._id, inv.invoiceNo)}
                          disabled={deleteLoading === inv._id}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            deleteLoading === inv._id
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                        >
                          {deleteLoading === inv._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Previous
              </button>

              {pageNumbers[0] > 1 && (
                <>
                  <button
                    onClick={() => goToPage(1)}
                    className={`px-3 py-2 rounded transition-colors ${
                      currentPage === 1
                        ? 'bg-blue-700 text-white font-bold'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    1
                  </button>
                  {pageNumbers[0] > 2 && <span className="text-gray-500">...</span>}
                </>
              )}

              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => goToPage(num)}
                  className={`px-3 py-2 rounded transition-colors ${
                    currentPage === num
                      ? 'bg-blue-700 text-white font-bold'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {num}
                </button>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <span className="text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => goToPage(totalPages)}
                    className={`px-3 py-2 rounded transition-colors ${
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
                className={`px-4 py-2 rounded transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* Pagination Info */}
          <div className="text-center text-gray-600 text-sm mt-4">
            Showing {indexOfFirstInvoice + 1} to {Math.min(indexOfLastInvoice, filteredInvoices.length)} of {filteredInvoices.length} invoices
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;