import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ViewInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/invoices/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Invoice not found');
        return res.json();
      })
      .then(data => {
        setInvoice(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading invoice...</p>;
  if (!invoice) return <p className="text-center mt-10 text-red-500">Invoice not found</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Invoice Details</h2>
      <p><strong>Invoice No:</strong> {invoice.invoiceNo}</p>
      <p><strong>Date:</strong> {invoice.date}</p>
      <p><strong>Customer:</strong> {invoice.customer}</p>
      <p><strong>Amount:</strong> ${invoice.amount.toFixed(2)}</p>
      <p><strong>First Item:</strong> {invoice.firstItem || '-'}</p>
      <p><strong>Balance:</strong> ${invoice.balance?.toFixed(2) || '0.00'}</p>
    </div>
  );
};

export default ViewInvoice;
