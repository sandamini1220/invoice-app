import { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const invoices = JSON.parse(localStorage.getItem('invoices')) || [];

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;

  // Pagination Logic
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);

  const handleDelete = (id) => {
    const updated = invoices.filter((inv) => inv.id !== id);
    localStorage.setItem('invoices', JSON.stringify(updated));
    window.location.reload();
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invoice Dashboard</h2>

      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="py-2 px-4 border">Invoice No</th>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Customer</th>
            <th className="py-2 px-4 border">Amount</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentInvoices.map((invoice) => (
            <tr key={invoice.id} className="text-center">
              <td className="py-2 px-4 border">{invoice.invoiceNo}</td>
              <td className="py-2 px-4 border">{invoice.date}</td>
              <td className="py-2 px-4 border">{invoice.customer}</td>
              <td className="py-2 px-4 border">{invoice.amount}</td>
              <td className="py-2 px-4 border space-x-2">
                <Link
                  to={`/invoice/${invoice.id}`}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  View
                </Link>
                <Link
                  to={`/edit/${invoice.id}`}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
