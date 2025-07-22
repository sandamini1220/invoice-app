import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoiceNo: '',
    date: '',
    customer: '',
    amount: '',
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/invoices/${id}`)
      .then(res => res.json())
      .then(data => setFormData({
        invoiceNo: data.invoiceNo,
        date: data.date.split('T')[0], // format date to yyyy-mm-dd
        customer: data.customer,
        amount: data.amount,
      }))
      .catch(err => console.error('Error fetching invoice:', err));
  }, [id]);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });

      if (response.ok) {
        navigate('/');
      } else {
        alert('Failed to update invoice');
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="invoiceNo"
          placeholder="Invoice No"
          value={formData.invoiceNo}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          name="customer"
          placeholder="Customer Name"
          value={formData.customer}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
          min="0"
          step="0.01"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Update Invoice
        </button>
      </form>
    </div>
  );
};

export default EditInvoice;
