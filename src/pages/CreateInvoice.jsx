import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateInvoice = () => {
  const [form, setForm] = useState({
    invoiceNo: '',
    date: '',
    customer: '',
    amount: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    fetch('http://localhost:5000/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save invoice');
        return res.json();
      })
      .then(() => {
        navigate('/');
      })
      .catch(err => {
        console.error(err);
        setError('Failed to save invoice');
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Invoice</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="invoiceNo"
          placeholder="Invoice No"
          value={form.invoiceNo}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="customer"
          placeholder="Customer Name"
          value={form.customer}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Invoice
        </button>
      </form>
    </div>
  );
};

export default CreateInvoice;
