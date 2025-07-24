import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      toast.success('Registered successfully! Please login.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" className="form-control my-2" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" className="form-control my-2" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" className="form-control my-2" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
