import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    invoiceNo: '',
    date: '',
    customer: '',
    amount: ''
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/invoices/${id}`)
      .then(res => res.json())
      .then(data => {
        const formattedDate = data.date || '';
        setFormData({
          invoiceNo: data.invoiceNo || '',
          date: formattedDate,
          customer: data.customer || '',
          amount: data.amount || ''
        });
      })
      .catch(err => {
        console.error('Failed to fetch invoice for editing', err);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:5000/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert('Invoice updated!');
      navigate('/');
    } else {
      alert('Update failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="invoiceNo"
          value={formData.invoiceNo}
          onChange={handleChange}
          placeholder="Invoice No"
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="customer"
          value={formData.customer}
          onChange={handleChange}
          placeholder="Customer"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Invoice
        </button>
      </form>
    </div>
  );
};

export default EditInvoice;
