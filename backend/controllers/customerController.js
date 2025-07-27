const Customer = require('../models/Customer');

exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};