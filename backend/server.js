// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();
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

// Routes
app.use('/api/invoices', invoiceRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Invoice API is running 🚀');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
