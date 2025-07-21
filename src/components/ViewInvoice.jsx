// src/components/ViewInvoice.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const ViewInvoice = () => {
  const { id } = useParams();
  const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
  const invoice = invoices.find(inv => inv.id === Number(id));

  if (!invoice) return <p className="text-center mt-10 text-red-500">Invoice not found</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Invoice Details</h2>
      <p><strong>Invoice No:</strong> {invoice.number}</p>
      <p><strong>Date:</strong> {invoice.date}</p>
      <p><strong>Customer:</strong> {invoice.customer}</p>
      <p><strong>Amount:</strong> ${invoice.amount}</p>
    </div>
  );
};

export default ViewInvoice;
