const mongoose = require('mongoose');
const Counter = require('./Counter');

const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, unique: true },
  date: { type: Date, required: true },
  customer: { type: String, required: true },
  amount: { type: Number, required: true },
  firstItem: { type: String, default: '' }, 
  balance: { type: Number, default: 0 },     
});

// Pre 'save' hook to auto-increment invoiceNo if new document
invoiceSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'invoiceNo' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.invoiceNo = 'INV' + counter.seq.toString().padStart(5, '0');
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
