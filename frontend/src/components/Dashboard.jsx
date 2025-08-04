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
      const invoiceData = response.data || response;
      setInvoices(Array.isArray(invoiceData) ? invoiceData : []);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
      if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
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
      const remainingInvoices = invoices.filter(inv => inv._id !== id);
      setInvoices(remainingInvoices);

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

  const filteredInvoices = invoices.filter(inv =>
    inv.customer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatCurrency = (amount) => {
    if (amount == null) return 'N/A';
    return `$${Number(amount).toFixed(2)}`;
  };

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
          className="btn btn-success"
        >
          + Add New Invoice
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          className="form-control"
          placeholder="Search by customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="alert alert-danger">
          <span>{error}</span>
          <button onClick={() => setError('')} className="close">×</button>
          <button onClick={fetchInvoices} className="btn btn-danger mt-2">Retry</button>
        </div>
      )}

      {!error && (
        <div className="mb-4 text-muted">
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

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12 text-muted">
          {searchTerm ? `No invoices found for "${searchTerm}"` : 'No invoices found'}
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="btn btn-link mt-2">Clear search</button>
          )}
        </div>
      ) : (
        <>
          <div className="table-responsive shadow rounded">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Invoice No</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>First Item</th>
                  <th className="text-end">Total Amount</th>
                  <th className="text-end">Balance</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.map((inv) => (
                  <tr key={inv._id}>
                    <td>{inv.invoiceNo || 'N/A'}</td>
                    <td>{formatDate(inv.date)}</td>
                    <td>{inv.customer || 'N/A'}</td>
                    <td>{inv.firstItem || 'N/A'}</td>
                    <td className="text-end">{formatCurrency(inv.amount)}</td>
                    <td className={`text-end ${inv.balance > 0 ? 'text-danger' : 'text-success'}`}>
                      {formatCurrency(inv.balance)}
                    </td>
                    <td className="text-center">
                      <div className="btn-group">
                        <Link to={`/edit/${inv._id}`} className="btn btn-sm btn-success">Edit</Link>
                        <button
                          onClick={() => handleDelete(inv._id, inv.invoiceNo)}
                          disabled={deleteLoading === inv._id}
                          className={`btn btn-sm ${deleteLoading === inv._id ? 'btn-secondary' : 'btn-danger'}`}
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
          <nav className="mt-4 d-flex justify-content-center">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={goToPrevPage}>Previous</button>
              </li>
              {pageNumbers.map(num => (
                <li key={num} className={`page-item ${currentPage === num ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => goToPage(num)}>{num}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={goToNextPage}>Next</button>
              </li>
            </ul>
          </nav>

          <div className="text-center text-muted small">
            Showing {indexOfFirstInvoice + 1} to {Math.min(indexOfLastInvoice, filteredInvoices.length)} of {filteredInvoices.length} invoices
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
