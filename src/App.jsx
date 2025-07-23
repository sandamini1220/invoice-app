import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import ViewInvoice from './components/ViewInvoice';
import Navigation from './components/Navigation';

const App = () => (
  <Router>
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<InvoiceForm />} />
        <Route path="/edit/:id" element={<InvoiceForm />} />
        <Route path="/invoice/:id" element={<ViewInvoice />} />
      </Routes>
    </div>
  </Router>
);

export default App;
