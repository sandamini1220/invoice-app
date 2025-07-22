import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InvoiceForm = () => {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [date, setDate] = useState('');
  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newInvoice = { invoiceNo, date, customer, amount: Number(amount) };

    try {
      const response = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice),
      });

      if (!response.ok) throw new Error('Failed to save invoice');

      navigate('/');  // Redirect back to Dashboard
    } catch (err) {
      console.error(err);
      setError('Failed to save invoice');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Create Invoice</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Invoice No"
          value={invoiceNo}
          onChange={(e) => setInvoiceNo(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Customer"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2 rounded"
          required
          min="0"
          step="0.01"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Save Invoice
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
