const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true },
  date: { type: String, required: true },
  customer: { type: String, required: true },
  amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
