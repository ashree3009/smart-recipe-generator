const express = require('express');
const {
  getShoppingItems,
  addShoppingItem,
  bulkAddShoppingItems,
  updateShoppingItem,
  togglePurchased,
  deleteShoppingItem,
  clearPurchasedItems,
  clearAllItems,
} = require('../controllers/shoppingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getShoppingItems);
router.post('/', addShoppingItem);
router.post('/bulk', bulkAddShoppingItems);
router.delete('/purchased', clearPurchasedItems);   // must come before /:id
router.delete('/all', clearAllItems);               // must come before /:id
router.put('/:id', updateShoppingItem);
router.patch('/:id/toggle', togglePurchased);
router.delete('/:id', deleteShoppingItem);

module.exports = router;
