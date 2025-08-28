require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

const { keycloak, memoryStore } = require('./config/keycloak');

// routes
const customerRoutes = require('./routes/customerRoutes');
const invoiceRoutes  = require('./routes/invoiceRoutes');
const itemRoutes     = require('./routes/itemRoutes');

const app = express();

// core middlewares
app.use(cors());
app.use(express.json());

// session for keycloak (required by keycloak-connect)
app.use(session({
  secret: 'change-this-secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// keycloak middleware
app.use(keycloak.middleware());

// DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => console.log('✅ MongoDB connected'));
mongoose.connection.on('error', err => console.error('❌ MongoDB error:', err));

// protect APIs
app.use('/api/customers', keycloak.protect(), customerRoutes);
app.use('/api/items',     keycloak.protect(), itemRoutes);

// Example RBAC: only realm role "admin" can access invoices
app.use('/api/invoices', keycloak.protect('realm:admin'), invoiceRoutes);

// test route
app.get('/protected', keycloak.protect(), (req, res) => {
  res.json({ message: 'Protected OK' });
});

// health
app.get('/', (req, res) => res.send('Invoice API running 🚀'));

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: { message: err.message || 'Internal Server Error' }});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
