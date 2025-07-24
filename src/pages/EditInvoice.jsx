import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditInvoiceForm from '../components/EditInvoiceForm';
import { getInvoiceById, updateInvoice } from '../api/invoiceAPI';

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await getInvoiceById(id);
        setInvoiceData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load invoice');
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleSave = async (updatedInvoice) => {
    try {
      await updateInvoice(id, updatedInvoice);
      alert('Invoice updated successfully');
      navigate('/');
    } catch (err) {
      alert('Failed to update invoice');
    }
  };

  if (loading) return <p>Loading invoice...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return <EditInvoiceForm invoiceData={invoiceData} onSave={handleSave} />;
};

export default EditInvoice;
