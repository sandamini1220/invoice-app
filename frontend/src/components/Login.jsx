import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      toast.success('Login successful');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" className="form-control my-2" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" className="form-control my-2" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-success">Login</button>
      </form>
    </div>
  );
};

export default Login;
