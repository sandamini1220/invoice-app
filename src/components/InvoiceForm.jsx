import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper: generate invoiceNo automatically for new invoices
const generateInvoiceNo = () => {
  return 'INV' + Date.now() + Math.floor(Math.random() * 900 + 100);
};

const InvoiceForm = () => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    invoiceNo: '',
    date: '',
    customer: '',
    amount: '',
    firstItem: '',
    balance: '',
  });

  const [error, setError] = useState('');

  // Load data if editing; else generate invoiceNo for new invoices
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/invoices/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            invoiceNo: data.invoiceNo,
            date: data.date.split('T')[0],
            customer: data.customer,
            amount: data.amount,
            firstItem: data.firstItem || '',
            balance: data.balance || '',
          });
        })
        .catch(() => setError('Failed to load invoice details'));
    } else {
      setFormData(prev => ({
        ...prev,
        invoiceNo: generateInvoiceNo(),
      }));
    }
  }, [id]);

  // Update form data on input changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit form data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id
        ? `http://localhost:5000/api/invoices/${id}`
        : 'http://localhost:5000/api/invoices';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          balance: Number(formData.balance),
        }),
      });

      if (!response.ok) throw new Error('Failed to save invoice');

      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save invoice');
    }
  };

  // Generate PDF from form content wrapped in #invoice-content
  const generatePDF = () => {
    const input = document.getElementById('invoice-content');
    if (!input) return;

    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('invoice.pdf');
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? 'Edit Invoice' : 'Create Invoice'}</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} id="invoice-content" className="space-y-4">
        <input
          type="text"
          name="invoiceNo"
          placeholder="Invoice No"
          value={formData.invoiceNo}
          readOnly
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="customer"
          placeholder="Customer Name"
          value={formData.customer}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="firstItem"
          placeholder="First Item"
          value={formData.firstItem}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="balance"
          placeholder="Balance"
          value={formData.balance}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="w-full p-2 border rounded"
        />

        <div className="flex justify-between items-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {id ? 'Update Invoice' : 'Save Invoice'}
          </button>

          <button
            type="button"
            onClick={generatePDF}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Download PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
