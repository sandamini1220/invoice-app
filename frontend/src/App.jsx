import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import EditInvoice from './pages/EditInvoice';
import Customers from './pages/Customers';
import Items from './pages/Items';

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <Routes>
          {/* Direct Public Routes (no authentication) */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<InvoiceForm />} />
          <Route path="/edit/:id" element={<EditInvoice />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/items" element={<Items />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
