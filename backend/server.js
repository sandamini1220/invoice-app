//pasword= 3N7wvVAt1MnTBHNx
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://admin:3N7wvVAt1MnTBHNx@cluster0.lf4cezd.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => console.log('MongoDB connected'));
db.on('error', (err) => console.error('MongoDB connection error:', err));

// Mongoose schema
const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true },
  date: { type: String, required: true },
  customer: { type: String, required: true },
  amount: { type: Number, required: true },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Root route
app.get('/', (req, res) => {
  res.send('Invoice API is running 🚀');
});

// Get all invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).send('Failed to fetch invoices');
  }
});

// Get single invoice by ID
app.get('/api/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).send('Invoice not found');
    res.json(invoice);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create new invoice
app.post('/api/invoices', async (req, res) => {
  try {
    const newInvoice = new Invoice(req.body);
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).send('Failed to save invoice');
  }
});

// Update invoice by ID
app.put('/api/invoices/:id', async (req, res) => {
  try {
    const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).send('Invoice not found');
    res.json(updated);
  } catch (err) {
    res.status(500).send('Failed to update invoice');
  }
});

// Delete invoice by ID
app.delete('/api/invoices/:id', async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send('Invoice not found');
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).send('Failed to delete invoice');
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
