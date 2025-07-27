import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editId, setEditId] = useState(null);
  const API_URL = 'http://localhost:5000/api/customers';

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(API_URL);
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ name: '', email: '', phone: '' });
      setEditId(null);
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (customer) => {
    setForm({ name: customer.name, email: customer.email, phone: customer.phone });
    setEditId(customer._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this customer?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchCustomers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Customer Management</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Customer Name"
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="Phone"
              required
            />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-primary w-100">
              {editId ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </form>

      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td className="text-end">
                <button onClick={() => handleEdit(customer)} className="btn btn-sm btn-warning me-2">Edit</button>
                <button onClick={() => handleDelete(customer._id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
