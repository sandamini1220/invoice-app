const Invoice = require('../models/Invoice');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Public (or Protected if you use auth)
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
// @access  Public (or Protected if you use auth)
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Public (or Protected if you use auth)
exports.createInvoice = async (req, res) => {
  const { invoiceNo, date, customer, firstItem, amount, balance } = req.body;

  // Validate required fields
  if (!date || !customer || !firstItem || amount == null || balance == null){
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newInvoice = new Invoice({
      date,
      customer,
      firstItem,
      amount,
      balance,
    });

    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update existing invoice
// @route   PUT /api/invoices/:id
// @access  Public (or Protected if you use auth)
exports.updateInvoice = async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(updatedInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Public (or Protected if you use auth)
exports.deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
