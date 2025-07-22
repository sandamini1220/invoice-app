import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import ViewInvoice from './components/ViewInvoice';
import EditInvoice from './components/EditInvoice';  
import Navigation from './components/Navigation';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<InvoiceForm />} />
          <Route path="/invoice/:id" element={<ViewInvoice />} />
          <Route path="/edit/:id" element={<EditInvoice />} />  
        </Routes>
      </div>
    </Router>
  );
};

export default App;
