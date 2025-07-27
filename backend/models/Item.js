const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  description: String,
  quantity: Number,
});

module.exports = mongoose.model('Item', itemSchema);
