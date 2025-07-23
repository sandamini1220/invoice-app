const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create invoice (invoiceNo is generated automatically by the model pre-save hook)
router.post('/', async (req, res) => {
  try {
    const { date, customer, amount, firstItem, balance } = req.body;

    if (!date || !customer || amount == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newInvoice = new Invoice({
      date,
      customer,
      amount,
      firstItem,
      balance,
      // no invoiceNo here - auto generated
    });

    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Update invoice by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Invoice not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Delete invoice by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

module.exports = router;
