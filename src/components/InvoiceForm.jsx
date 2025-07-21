// src/components/InvoiceForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState({
    number: '',
    date: '',
    customer: '',
    amount: ''
  });

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const savedInvoices = JSON.parse(localStorage.getItem('invoices')) || [];
    savedInvoices.push({ ...invoice, id: Date.now() });
    localStorage.setItem('invoices', JSON.stringify(savedInvoices));
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="number" placeholder="Invoice No" className="w-full border p-2" onChange={handleChange} required />
        <input type="date" name="date" className="w-full border p-2" onChange={handleChange} required />
        <input type="text" name="customer" placeholder="Customer" className="w-full border p-2" onChange={handleChange} required />
        <input type="number" name="amount" placeholder="Amount" className="w-full border p-2" onChange={handleChange} required />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save Invoice</button>
      </form>
    </div>
  );
};

export default InvoiceForm;
