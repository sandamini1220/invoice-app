import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Items = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '' });
  const [editId, setEditId] = useState(null);
  const API_URL = 'http://localhost:5000/api/items';

  // Fetch items on load
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
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
      setForm({ name: '', price: '', description: '' });
      setEditId(null);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, price: item.price, description: item.description });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this item?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchItems();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Item Management</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Item Name"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="form-control"
              placeholder="Price"
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Description"
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
            <th>Item Name</th>
            <th>Price</th>
            <th>Description</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.description}</td>
              <td className="text-end">
                <button onClick={() => handleEdit(item)} className="btn btn-sm btn-warning me-2">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Items;
