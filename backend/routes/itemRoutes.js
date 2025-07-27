const express = require('express');
const router = express.Router();
const {
  getItems,
  createItem,
  getItemById,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');

// Route: /api/items
router.get('/', getItems);
router.post('/', createItem);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
