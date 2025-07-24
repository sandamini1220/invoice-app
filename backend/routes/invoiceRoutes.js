const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} = require('../controllers/invoiceController');

router.get('/', protect, getInvoices);
router.get('/:id', protect, getInvoiceById);
router.post('/', protect, createInvoice);
router.put('/:id', protect, updateInvoice);
router.delete('/:id', protect, deleteInvoice);

module.exports = router;
